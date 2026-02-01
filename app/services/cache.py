import json
import time
import hashlib
from pathlib import Path
from typing import Any, Optional, Dict

CACHE_DIR = Path("app/cache")
CACHE_DIR.mkdir(parents=True, exist_ok=True)

def _stable_json(obj: Any) -> str:
    """
    Stable serialization so hashing is consistent.
    """
    return json.dumps(obj, sort_keys=True, ensure_ascii=False, separators=(",", ":"))

def make_cache_key(prefix: str, payload: Any) -> str:
    raw = (prefix + "|" + _stable_json(payload)).encode("utf-8")
    digest = hashlib.sha256(raw).hexdigest()
    return f"{prefix}_{digest}"

def cache_get(key: str, ttl_seconds: Optional[int] = None) -> Optional[Dict[str, Any]]:
    path = CACHE_DIR / f"{key}.json"
    if not path.exists():
        return None

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None

    if ttl_seconds is not None:
        saved_at = data.get("_saved_at")
        if not isinstance(saved_at, (int, float)):
            return None
        if time.time() - saved_at > ttl_seconds:
            # expired
            try:
                path.unlink(missing_ok=True)
            except Exception:
                pass
            return None

    # Return cached payload (without metadata)
    data.pop("_saved_at", None)
    return data

def cache_set(key: str, value: Dict[str, Any]) -> None:
    path = CACHE_DIR / f"{key}.json"
    payload = dict(value)
    payload["_saved_at"] = time.time()
    path.write_text(_stable_json(payload), encoding="utf-8")
