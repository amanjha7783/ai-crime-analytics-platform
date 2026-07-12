from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from backend.app.core.security import get_current_user
from backend.app.domain.schemas import LoginRequest, TokenResponse, UserOut
from backend.app.services.auth_service import AuthService


router = APIRouter(tags=["auth"])
auth_service = AuthService()


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> dict:
    response = auth_service.login(payload.username, payload.password)
    if response is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return response


@router.get("/me", response_model=UserOut)
def me(current_user: dict = Depends(get_current_user)) -> dict:
    return {
        "username": current_user["sub"],
        "full_name": current_user.get("full_name", ""),
        "role": current_user["role"],
    }
