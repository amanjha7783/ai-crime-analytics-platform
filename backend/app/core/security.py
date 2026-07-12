from __future__ import annotations

import base64
import hashlib
import hmac
import json
from datetime import UTC, datetime, timedelta

from backend.app.core.config import get_settings
from fastapi import Depends, Header, HTTPException, status


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, password_hash: str) -> bool:
    return hmac.compare_digest(hash_password(password), password_hash)


def create_access_token(subject: str, role: str, full_name: str) -> str:
    settings = get_settings()
    payload = {
        "sub": subject,
        "role": role,
        "full_name": full_name,
        "exp": (datetime.now(UTC) + timedelta(minutes=settings.access_token_expire_minutes)).isoformat(),
    }
    payload_bytes = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    signature = hmac.new(settings.secret_key.encode("utf-8"), payload_bytes, hashlib.sha256).digest()
    return ".".join(
        [
            base64.urlsafe_b64encode(payload_bytes).decode("utf-8").rstrip("="),
            base64.urlsafe_b64encode(signature).decode("utf-8").rstrip("="),
        ]
    )


def _b64url_decode(input_str: str) -> bytes:
    padding = "=" * (-len(input_str) % 4)
    return base64.urlsafe_b64decode(input_str + padding)


def verify_access_token(token: str) -> dict:
    """Verify token signature and expiry, return payload dict."""
    settings = get_settings()
    try:
        payload_b64, signature_b64 = token.split(".")
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token format")

    try:
        payload_bytes = _b64url_decode(payload_b64)
        signature = _b64url_decode(signature_b64)
        expected_sig = hmac.new(settings.secret_key.encode("utf-8"), payload_bytes, hashlib.sha256).digest()
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token encoding")

    if not hmac.compare_digest(expected_sig, signature):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token signature")

    try:
        payload = json.loads(payload_bytes.decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    exp = payload.get("exp")
    if exp is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing expiry")
    try:
        exp_dt = datetime.fromisoformat(exp)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token expiry")

    if datetime.now(UTC) > exp_dt:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")

    return payload


def get_current_user(authorization: str | None = Header(None)) -> dict:
    """FastAPI dependency to extract current user from Authorization header.

    Usage: `Depends(get_current_user)` in route definitions. It returns the token payload
    which includes `sub` and `role`.
    """
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authorization header")
    token = parts[1]
    return verify_access_token(token)
