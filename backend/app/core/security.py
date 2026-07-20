from __future__ import annotations

from datetime import UTC, datetime, timedelta

import bcrypt
from fastapi import Depends, Header, HTTPException, status
from jose import JWTError, jwt

from backend.app.core.config import get_settings

# ---------------------------------------------------------------------------
# Password hashing – bcrypt (direct)
# ---------------------------------------------------------------------------


def hash_password(password: str) -> str:
    """Return a bcrypt hash of *password*."""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    """Verify *password* against a bcrypt *password_hash*."""
    try:
        return bcrypt.checkpw(
            password.encode("utf-8"), password_hash.encode("utf-8")
        )
    except Exception:
        return False


# ---------------------------------------------------------------------------
# JWT access tokens – python-jose
# ---------------------------------------------------------------------------
ALGORITHM = "HS256"


def create_access_token(subject: str, role: str, full_name: str) -> str:
    """Create a signed JWT containing user claims."""
    settings = get_settings()
    expire = datetime.now(UTC) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {
        "sub": subject,
        "role": role,
        "full_name": full_name,
        "exp": expire,
    }
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def verify_access_token(token: str) -> dict:
    """Verify a JWT token's signature and expiry, return the payload dict."""
    settings = get_settings()
    try:
        payload: dict = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {exc}",
        )
    return payload


# ---------------------------------------------------------------------------
# FastAPI dependency
# ---------------------------------------------------------------------------
def get_current_user(authorization: str | None = Header(None)) -> dict:
    """FastAPI dependency – extract and verify the current user from the
    ``Authorization: Bearer <token>`` header.

    Returns the decoded JWT payload which includes ``sub``, ``role``, and
    ``full_name``.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
        )
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header – expected 'Bearer <token>'",
        )
    token = parts[1]
    return verify_access_token(token)
