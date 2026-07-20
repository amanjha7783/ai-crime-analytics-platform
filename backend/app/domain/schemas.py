from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field, field_validator


class LoginRequest(BaseModel):
    username: str
    password: str


class SignupRequest(BaseModel):
    username: str
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1)
    role: str = Field(default="Analyst")

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        v = v.strip()
        if not v or len(v) < 3:
            raise ValueError("Username must be at least 3 characters")
        return v


class UserOut(BaseModel):
    username: str
    full_name: str
    role: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class SignupResponse(BaseModel):
    message: str
    user: UserOut


class HealthResponse(BaseModel):
    status: str
    service: str
    environment: str


class CrimeFilters(BaseModel):
    district: str | None = None
    crime_type: str | None = None
    police_station: str | None = None
    status: str | None = None
    year: int | None = None


class DashboardResponse(BaseModel):
    kpis: dict[str, Any]
    district_ranking: list[dict[str, Any]]
    trend: list[dict[str, Any]]
    crime_mix: list[dict[str, Any]]
    alerts: list[dict[str, Any]]


class ReportResponse(BaseModel):
    title: str
    generated_for: str
    summary: str
    sections: list[dict[str, Any]] = Field(default_factory=list)
