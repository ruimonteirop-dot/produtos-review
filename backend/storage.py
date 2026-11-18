import os
import logging

import requests

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
APP_NAME = "myg-reviews"
storage_key = None


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": os.environ["EMERGENT_LLM_KEY"]}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def _call(method: str, path: str, **kw):
    for attempt in range(2):
        key = init_storage(force=attempt == 1)
        headers = {"X-Storage-Key": key, **kw.pop("headers", {})}
        resp = requests.request(method, f"{STORAGE_URL}/objects/{path}", headers=headers, **kw)
        if resp.status_code != 404 or attempt == 1 or method == "GET":
            resp.raise_for_status()
            return resp
        logging.getLogger(__name__).warning("storage 404, re-init")
    return resp


def put_object(path: str, data: bytes, content_type: str) -> dict:
    return _call("PUT", path, headers={"Content-Type": content_type}, data=data, timeout=120).json()


def get_object(path: str) -> tuple[bytes, str]:
    resp = _call("GET", path, timeout=60)
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")
