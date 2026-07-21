from __future__ import annotations

from fastapi import APIRouter, Query

from backend.app.services.analytics_service import AnalyticsService


router = APIRouter(tags=["crimes"])
service = AnalyticsService()


@router.get("/crimes")
def list_crimes(
    skip: int = 0,
    limit: int = Query(500, le=50000),
    district: str | None = Query(default=None),
    crime_type: str | None = Query(default=None),
    police_station: str | None = Query(default=None),
    status: str | None = Query(default=None),
    year: int | None = Query(default=None),
) -> list[dict]:
    # Pass the limit directly without arbitrary caps, as requested for full dataset support
    return service.crimes(
        district=district,
        crime_type=crime_type,
        police_station=police_station,
        status=status,
        year=year,
        skip=skip,
        limit=limit,
    )
