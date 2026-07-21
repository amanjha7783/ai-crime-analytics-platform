from __future__ import annotations

from fastapi import APIRouter

from backend.app.services.analytics_service import AnalyticsService


router = APIRouter(tags=["intelligence"])
service = AnalyticsService()


@router.get("/hotspots")
def hotspots() -> list[dict]:
    return service.hotspots()


@router.get("/predictions")
def predictions() -> dict:
    return service.predictions()


@router.get("/network")
def network(focus_node: str | None = None, max_nodes: int = 500) -> dict:
    return service.network(focus_node=focus_node, max_nodes=max_nodes)


@router.get("/repeat-offenders")
def repeat_offenders() -> list[dict]:
    return service.repeat_offenders()


@router.get("/anomalies")
def anomalies() -> list[dict]:
    return service.anomalies()


@router.get("/reports")
def reports() -> dict:
    return service.report()
