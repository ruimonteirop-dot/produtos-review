import asyncio
import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile
from pydantic import BaseModel, Field

from auth import require_admin
from db import db
from storage import APP_NAME, get_object, put_object

router = APIRouter(prefix="/api")
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
    category: str = Field(min_length=1, max_length=40)
    score: float = Field(ge=0, le=10)
    tag: str = Field(default="", max_length=40)
    summary: str = Field(default="", max_length=600)
    pros: List[str] = []
    cons: List[str] = []
    specs: List[Spec] = []
    photos: List[Photo] = []
    price_url: str = Field(default="", max_length=1000)
    published: bool = True
    featured: bool = False


class Review(ReviewIn):
    id: str
    created_at: str
    updated_at: str


async def _unset_other_featured(keep_id: str):
    await db.reviews.update_many({"id": {"$ne": keep_id}, "featured": True}, {"$set": {"featured": False}})


@router.get("/reviews", response_model=List[Review])
async def public_reviews():
    return await db.reviews.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(200)


@router.get("/admin/reviews", response_model=List[Review])
async def admin_reviews(_=Depends(require_admin)):
    return await db.reviews.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@router.post("/admin/reviews", response_model=Review)
async def create_review(body: ReviewIn, _=Depends(require_admin)):
    now = datetime.now(timezone.utc).isoformat()
    review = Review(**body.model_dump(), id=str(uuid.uuid4()), created_at=now, updated_at=now)
    await db.reviews.insert_one(review.model_dump())
    if review.featured:
        await _unset_other_featured(review.id)
    return review


@router.put("/admin/reviews/{rid}", response_model=Review)
async def update_review(rid: str, body: ReviewIn, _=Depends(require_admin)):
    data = {**body.model_dump(), "updated_at": datetime.now(timezone.utc).isoformat()}
    res = await db.reviews.find_one_and_update({"id": rid}, {"$set": data}, projection={"_id": 0}, return_document=True)
    if not res:
        raise HTTPException(404, "Review não encontrada")
    if body.featured:
        await _unset_other_featured(rid)
    return res


@router.delete("/admin/reviews/{rid}")
async def delete_review(rid: str, _=Depends(require_admin)):
    res = await db.reviews.delete_one({"id": rid})
    if not res.deleted_count:
        raise HTTPException(404, "Review não encontrada")
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
    result = await asyncio.to_thread(put_object, path, data, MIME[ext])
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


SEED = [
    {
        "name": "Seladora a Vácuo AP-25", "category": "Cozinha", "score": 8.7, "tag": "Escolha do Myg", "featured": True,
        "summary": "Inox escovado, quatro botões e zero complicações. Testei a AP-25 a selar carne, queijo e cereais — e passou a fazer parte da rotina da cozinha.",
        "pros": ["4 modos para alimentos: Dry, Moist, Moist+ e Soft", "Botão Pulse para controlar o vácuo à mão", "Seal Only: sela sem retirar o ar", "Acabamento em inox escovado, bonito na bancada"],
        "cons": ["Painel todo em inglês", "Sacos de substituição vendidos à parte"],
        "specs": [{"label": "Modelo", "value": "AP-25"}, {"label": "Tipo", "value": "Seladora a vácuo doméstica"}, {"label": "Na caixa", "value": "Seladora, cabo e sacos"}, {"label": "Painel", "value": "Tátil com visor"}],
        "photos": [{"src": "/products/unboxed.webp", "label": "Fora da caixa"}, {"src": "/products/wrapped.webp", "label": "Unboxing"}, {"src": "/products/box.webp", "label": "A caixa"}],
    },
    {"name": "Air Fryer Digital 4L", "category": "Cozinha", "score": 9.1, "tag": "Mais pedida", "photos": [{"src": "/products/airfryer.jpg", "label": "Air Fryer"}]},
    {"name": "Auscultadores Bluetooth ANC", "category": "Áudio", "score": 8.9, "tag": "Boa relação qualidade-preço", "photos": [{"src": "/products/fone.jpg", "label": "Auscultadores"}]},
    {"name": "Robot Aspirador Inteligente", "category": "Casa", "score": 8.4, "tag": "Preguiça aprovada", "photos": [{"src": "/products/robo.jpg", "label": "Robot"}]},
    {"name": "Máquina de Café Expresso Manual", "category": "Cozinha", "score": 9.3, "tag": "Favorita", "photos": [{"src": "/products/espresso.jpg", "label": "Máquina de café"}]},
]


async def seed_reviews():
    if await db.reviews.count_documents({}) > 0:
        return
    base = datetime.now(timezone.utc).timestamp()
    for i, item in enumerate(SEED):
        ts = datetime.fromtimestamp(base - i * 60, timezone.utc).isoformat()
        review = Review(**ReviewIn(**item).model_dump(), id=str(uuid.uuid4()), created_at=ts, updated_at=ts)
        await db.reviews.insert_one(review.model_dump())
