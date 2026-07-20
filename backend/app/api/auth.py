from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from backend.app.core.security import get_current_user
from backend.app.domain.schemas import (
    LoginRequest,
    SignupRequest,
    SignupResponse,
    TokenResponse,
    UserOut,
)
from backend.app.services.auth_service import AuthService


router = APIRouter(tags=["auth"])
auth_service = AuthService()


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> dict:
    """Authenticate a user and return a JWT access token."""
    try:
        response = auth_service.login(payload.username, payload.password)
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        )
    if response is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    return response


@router.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest) -> dict:
    """Register a new user account."""
    try:
        user_info = auth_service.signup(
            username=payload.username,
            password=payload.password,
            full_name=payload.full_name,
            role=payload.role,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        )
    return {"message": "Account created successfully", "user": user_info}


@router.post("/logout")
def logout() -> dict:
    """Client-acknowledged logout.  The frontend should discard its stored
    token.  This endpoint exists so that the frontend has an explicit server
    endpoint to call and the flow is complete."""
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserOut)
def me(current_user: dict = Depends(get_current_user)) -> dict:
    """Return the profile of the currently authenticated user."""
    return {
        "username": current_user["sub"],
        "full_name": current_user.get("full_name", ""),
        "role": current_user["role"],
    }
