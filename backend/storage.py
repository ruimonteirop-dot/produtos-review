"""Armazenamento das fotos no Cloudflare R2 (compatível com S3).

Variáveis de ambiente:
  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
"""
import os
import logging

import boto3
from botocore.config import Config

APP_NAME = "myg-reviews"
_client = None
log = logging.getLogger(__name__)


def _bucket() -> str:
    return os.environ["R2_BUCKET"]


def init_storage(force: bool = False):
    global _client
    if _client is not None and not force:
        return _client
    if not os.environ.get("R2_ACCOUNT_ID"):
        log.warning("R2 não configurado: o upload de fotos fica desligado até definir as variáveis R2_*.")
        return None
    _client = boto3.client(
        "s3",
        endpoint_url=f"https://{os.environ['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com",
        aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
        region_name="auto",
        config=Config(signature_version="s3v4", retries={"max_attempts": 3}),
    )
    return _client


def _require():
    client = init_storage()
    if client is None:
        raise RuntimeError("Armazenamento de fotos não configurado (R2_*).")
    return client


def put_object(path: str, data: bytes, content_type: str) -> dict:
    _require().put_object(Bucket=_bucket(), Key=path, Body=data, ContentType=content_type)
    return {"path": path, "size": len(data)}


def get_object(path: str) -> tuple[bytes, str]:
    obj = _require().get_object(Bucket=_bucket(), Key=path)
    return obj["Body"].read(), obj.get("ContentType", "application/octet-stream")
