from __future__ import annotations

from fastapi import APIRouter, Query

from backend.app.services.analytics_service import AnalyticsService


router = APIRouter(tags=["search"])
service = AnalyticsService()


@router.get("/search")
def search(q: str = Query(min_length=2, description="FIR, criminal, location, district, or crime type")) -> dict:
    return service.search(q)
