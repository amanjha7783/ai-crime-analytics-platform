from __future__ import annotations

from fastapi import APIRouter

from backend.app.services.analytics_service import AnalyticsService


router = APIRouter(tags=["dashboard"])
service = AnalyticsService()


@router.get("/dashboard")
def dashboard() -> dict:
    return service.dashboard()
