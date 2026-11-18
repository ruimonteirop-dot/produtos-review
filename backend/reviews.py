import asyncio
import logging
import os
import re
import unicodedata
import uuid
from datetime import datetime, timezone
from typing import List, Optional

import requests
from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile
from pydantic import BaseModel, Field

from auth import require_admin
from db import db
from storage import APP_NAME, get_object, put_object

router = APIRouter(prefix="/api")
log = logging.getLogger(__name__)
MIME = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp", "gif": "image/gif", "heic": "image/heic"}
MAX_BYTES = 10 * 1024 * 1024


class Photo(BaseModel):
    src: str
    label: str = ""


class Spec(BaseModel):
    label: str
    value: str


class ReviewIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    slug: str = Field(default="", max_length=120)
    category: str = Field(min_length=1, max_length=40)
    score: Optional[float] = Field(default=None, ge=0, le=10)
    tag: str = Field(default="", max_length=40)
    summary: str = Field(default="", max_length=600)
    body: str = Field(default="", max_length=40000)
    pros: List[str] = []
    cons: List[str] = []
    specs: List[Spec] = []
    photos: List[Photo] = []
    price_url: str = Field(default="", max_length=1000)
    vine: bool = False
    published: bool = True
    featured: bool = False


class Review(ReviewIn):
    id: str
    created_at: str
    updated_at: str


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text[:80] or "review"


async def _unique_slug(wanted: str, exclude_id: Optional[str] = None) -> str:
    base = slugify(wanted)
    slug, n = base, 2
    while await db.reviews.find_one({"slug": slug, **({"id": {"$ne": exclude_id}} if exclude_id else {})}):
        slug, n = f"{base}-{n}", n + 1
    return slug


def _trigger_rebuild():
    """Pede ao Vercel um novo deploy para regenerar as páginas estáticas (SEO)."""
    hook = os.environ.get("VERCEL_DEPLOY_HOOK_URL")
    if not hook:
        return

    def _go():
        try:
            requests.post(hook, timeout=15)
        except Exception as exc:  # nunca falhar a gravação por causa do deploy
            log.warning("Deploy hook falhou: %s", exc)

    asyncio.get_running_loop().run_in_executor(None, _go)


async def _unset_other_featured(keep_id: str):
    await db.reviews.update_many({"id": {"$ne": keep_id}, "featured": True}, {"$set": {"featured": False}})


@router.get("/reviews", response_model=List[Review])
async def public_reviews():
    return await db.reviews.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(500)


@router.get("/reviews/{slug}", response_model=Review)
async def public_review(slug: str):
    review = await db.reviews.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not review:
        raise HTTPException(404, "Review não encontrada")
    return review


@router.get("/admin/reviews", response_model=List[Review])
async def admin_reviews(_=Depends(require_admin)):
    return await db.reviews.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@router.post("/admin/reviews", response_model=Review)
async def create_review(body: ReviewIn, _=Depends(require_admin)):
    now = datetime.now(timezone.utc).isoformat()
    data = body.model_dump()
    data["slug"] = await _unique_slug(body.slug or body.name)
    review = Review(**data, id=str(uuid.uuid4()), created_at=now, updated_at=now)
    await db.reviews.insert_one(review.model_dump())
    if review.featured:
        await _unset_other_featured(review.id)
    _trigger_rebuild()
    return review


@router.put("/admin/reviews/{rid}", response_model=Review)
async def update_review(rid: str, body: ReviewIn, _=Depends(require_admin)):
    data = {**body.model_dump(), "updated_at": datetime.now(timezone.utc).isoformat()}
    data["slug"] = await _unique_slug(body.slug or body.name, exclude_id=rid)
    res = await db.reviews.find_one_and_update({"id": rid}, {"$set": data}, projection={"_id": 0}, return_document=True)
    if not res:
        raise HTTPException(404, "Review não encontrada")
    if body.featured:
        await _unset_other_featured(rid)
    _trigger_rebuild()
    return res


@router.delete("/admin/reviews/{rid}")
async def delete_review(rid: str, _=Depends(require_admin)):
    res = await db.reviews.delete_one({"id": rid})
    if not res.deleted_count:
        raise HTTPException(404, "Review não encontrada")
    _trigger_rebuild()
    return {"ok": True}


@router.post("/admin/upload")
async def upload(file: UploadFile = File(...), _=Depends(require_admin)):
    ext = (file.filename or "").rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else ""
    if ext not in MIME:
        raise HTTPException(400, "Formato não suportado. Usa JPG, PNG, WEBP ou HEIC.")
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(400, "Foto demasiado grande (máx. 10 MB).")
    path = f"{APP_NAME}/reviews/{uuid.uuid4()}.{ext}"
    try:
        result = await asyncio.to_thread(put_object, path, data, MIME[ext])
    except RuntimeError as exc:
        raise HTTPException(503, str(exc))
    await db.files.insert_one({
        "id": str(uuid.uuid4()), "storage_path": result["path"], "original_filename": file.filename,
        "content_type": MIME[ext], "size": result.get("size", len(data)), "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"src": f"/api/files/{result['path']}"}


@router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(404, "Ficheiro não encontrado")
    data, ctype = await asyncio.to_thread(get_object, path)
    return Response(content=data, media_type=record.get("content_type", ctype), headers={"Cache-Control": "public, max-age=31536000, immutable"})


AP25_BODY = """## Para que serve e para quem é
Um selador de vácuo prolonga a vida dos alimentos no frigorífico e no congelador, e arruma-os melhor: os sacos ficam espalmados e empilham-se sem desperdiçar espaço. O AP-25 faz sentido para quem compra carne ou peixe em quantidade e congela por porções, prepara refeições para a semana ou cozinha em sous-vide. Se só quer fechar um pacote de café de vez em quando, um modelo mais simples chega.

## O que vem na caixa
A caixa traz tudo o que é preciso para começar: o selador com tampa em aço escovado e ecrã LED, o cabo de alimentação destacável com ficha europeia, cinco sacos, um rolo de saco gofrado e o tubo para a ligação externa.

## Os botões e os seis modos
Seis modos e vários níveis de vácuo, todos geridos a partir de quatro botões:
- **Food**: escolhe o tipo de alimento (Dry, Moist, Moist+ ou Soft) e ajusta o vácuo e o tempo de selagem.
- **Pulse**: vácuo manual, para parar antes de esmagar pão, bolos ou fruta.
- **Seal Only**: fecha sem tirar o ar. Serve para fazer sacos a partir do rolo.
- **Start/Stop**: arranca o ciclo automático ou interrompe-o.

É aqui que está a curva de aprendizagem. São muitas combinações para quatro botões, e nas primeiras utilizações vale a pena ter o manual por perto. Depois de perceber a lógica, torna-se rotina.

## Como é no dia a dia
### Selagem
A dupla bomba tira o ar com firmeza e a dupla selagem dá mais segurança ao fecho. É o que importa num selador: um saco que abre no congelador estraga o que lá está dentro.

### Cortador e sacos à medida
O cortador desliza ao longo da tampa e corta o rolo direito, sem tesoura. Com o modo Seal Only fecha-se o fundo e faz-se um saco do tamanho exato, o que poupa material.

### Limpeza
Os alimentos húmidos acabam sempre por libertar algum líquido. Aqui fica num tabuleiro que se tira e lava à parte, em vez de ficar entranhado no aparelho.

### Recipientes com válvula
A ligação externa permite tirar o ar de caixas e sacos com válvula, útil para o que não convém espalmar, como queijos frescos ou sobras.

### A tampa
É o ponto menos conseguido. Para trancar bem é preciso carregar com alguma força, o que se nota quando se selam vários sacos seguidos.

## Vale a pena?
Sim, para quem usa o vácuo com frequência. O AP-25 junta num aparelho compacto o que normalmente só se encontra em modelos maiores. O painel exige uns dias de habituação e a tampa podia fechar com menos esforço, mas nenhum dos dois pesa no resultado final."""

SEED = [
    {
        "name": "CAREHABI AP-25", "slug": "carehabi-ap-25-selador-de-vacuo", "category": "Cozinha", "score": None,
        "tag": "Selador de vácuo", "featured": True, "vine": True,
        "summary": "Um selador versátil e compacto, com dupla bomba, dupla selagem, cortador e ligação para recipientes. O painel pede uns dias de habituação e a tampa fecha com alguma força, mas nada disso pesa no resultado.",
        "body": AP25_BODY,
        "pros": ["Compacto, cabe em cozinhas pequenas", "Dupla bomba e dupla selagem", "Cortador integrado para sacos à medida", "Tabuleiro de líquidos removível", "Ligação para recipientes com válvula"],
        "cons": ["Muitas opções no painel, leva tempo a dominar", "A tampa exige pressão para trancar"],
        "specs": [
            {"label": "Marca e modelo", "value": "CAREHABI AP-25"},
            {"label": "Modos", "value": "6: Dry, Moist, Moist+, Soft, Pulse, Seal Only"},
            {"label": "Bomba e selagem", "value": "Dupla bomba, dupla selagem"},
            {"label": "Cortador", "value": "Integrado, deslizante"},
            {"label": "Tabuleiro de líquidos", "value": "Removível"},
            {"label": "Ligação externa", "value": "Recipientes e sacos com válvula"},
            {"label": "Incluído", "value": "5 sacos, rolo, tubo, cabo europeu"},
        ],
        "photos": [
            {"src": "/products/ap25-hero.jpg", "label": "O AP-25"},
            {"src": "/products/ap25-caixa.jpg", "label": "A caixa"},
            {"src": "/products/ap25-unboxing.jpg", "label": "O que vem na caixa"},
            {"src": "/products/ap25-real.jpg", "label": "Acabado de desembalar"},
        ],
    },
]


async def seed_reviews():
    # Reviews antigas sem slug ganham um (migração)
    async for r in db.reviews.find({"$or": [{"slug": {"$exists": False}}, {"slug": ""}]}, {"_id": 0, "id": 1, "name": 1}):
        await db.reviews.update_one({"id": r["id"]}, {"$set": {"slug": await _unique_slug(r["name"], exclude_id=r["id"])}})
    if await db.reviews.count_documents({}) > 0:
        return
    now = datetime.now(timezone.utc).isoformat()
    for item in SEED:
        review = Review(**ReviewIn(**item).model_dump(), id=str(uuid.uuid4()), created_at=now, updated_at=now)
        await db.reviews.insert_one(review.model_dump())
