import os
import uuid
from datetime import datetime, timezone, timedelta

import bcrypt
import jwt
from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel

from db import db

JWT_ALGORITHM = "HS256"
MAX_ATTEMPTS = 5
LOCK_MINUTES = 15

router = APIRouter(prefix="/api/auth")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def _token(sub: str, email: str, minutes: int, kind: str) -> str:
    payload = {"sub": sub, "email": email, "type": kind, "exp": datetime.now(timezone.utc) + timedelta(minutes=minutes)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def _set_cookies(response: Response, user: dict) -> str:
    access = _token(user["id"], user["email"], 60 * 12, "access")
    refresh = _token(user["id"], user["email"], 60 * 24 * 7, "refresh")
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=60 * 60 * 12, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none", max_age=604800, path="/")
    return access


def _public(user: dict) -> dict:
    return {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")}


async def require_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    header = request.headers.get("Authorization", "")
    if not token and header.startswith("Bearer "):
        token = header[7:]
    if not token:
        raise HTTPException(401, "Sessão não iniciada")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Sessão expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Sessão inválida")
    if payload.get("type") != "access":
        raise HTTPException(401, "Sessão inválida")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(403, "Sem permissão")
    return user


class LoginIn(BaseModel):
    email: str
    password: str


@router.post("/login")
async def login(body: LoginIn, request: Request, response: Response):
    email = body.email.strip().lower()
    ident = f"{request.client.host if request.client else 'x'}:{email}"
    now = datetime.now(timezone.utc)
    att = await db.login_attempts.find_one({"identifier": ident})
    if att and att.get("count", 0) >= MAX_ATTEMPTS and att.get("locked_until", "") > now.isoformat():
        raise HTTPException(429, "Demasiadas tentativas. Tenta novamente daqui a 15 minutos.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        count = (att or {}).get("count", 0) + 1
        if att and att.get("locked_until", "") and att["locked_until"] <= now.isoformat():
            count = 1
        await db.login_attempts.update_one(
            {"identifier": ident},
            {"$set": {"count": count, "locked_until": (now + timedelta(minutes=LOCK_MINUTES)).isoformat() if count >= MAX_ATTEMPTS else ""}},
            upsert=True,
        )
        raise HTTPException(401, "Email ou palavra-passe incorretos")
    await db.login_attempts.delete_one({"identifier": ident})
    token = _set_cookies(response, user)
    return {**_public(user), "token": token}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/", secure=True, samesite="none")
    response.delete_cookie("refresh_token", path="/", secure=True, samesite="none")
    return {"ok": True}


@router.get("/me")
async def me(request: Request):
    return _public(await require_admin(request))


async def seed_admin():
    email = os.environ["ADMIN_EMAIL"].strip().lower()
    if await db.users.find_one({"email": email}) is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()), "email": email, "password_hash": hash_password(os.environ["ADMIN_PASSWORD"]),
            "name": "Admin", "role": "admin", "created_at": datetime.now(timezone.utc).isoformat(),
        })
