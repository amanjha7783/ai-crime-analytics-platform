from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api import analytics, auth, crimes, dashboard, health, intelligence, search
from backend.app.core.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description="AI-powered crime analytics and visualization platform for police intelligence.",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.backend_cors_origins),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    for router in [health.router, auth.router, dashboard.router, crimes.router, intelligence.router, search.router, analytics.router]:
        app.include_router(router, prefix=settings.api_prefix)
    return app


app = create_app()
