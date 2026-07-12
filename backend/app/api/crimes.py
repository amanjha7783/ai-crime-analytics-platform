from __future__ import annotations

from fastapi import APIRouter, Query

from backend.app.services.analytics_service import AnalyticsService


router = APIRouter(tags=["crimes"])
service = AnalyticsService()


@router.get("/crimes")
def list_crimes(
    district: str | None = Query(default=None),
    crime_type: str | None = Query(default=None),
    police_station: str | None = Query(default=None),
    status: str | None = Query(default=None),
    year: int | None = Query(default=None),
) -> list[dict]:
    return service.crimes(
        district=district,
        crime_type=crime_type,
        police_station=police_station,
        status=status,
        year=year,
    )
