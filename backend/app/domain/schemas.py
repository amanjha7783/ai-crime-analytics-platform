from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    username: str
    full_name: str
    role: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
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
