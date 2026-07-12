from __future__ import annotations

from fastapi import APIRouter

from backend.app.services.analytics_service import AnalyticsService


router = APIRouter(prefix="/analytics", tags=["analytics"])
service = AnalyticsService()


@router.get("/socio-economic")
def socio_economic() -> dict:
    return service.socio_economic_correlation()
