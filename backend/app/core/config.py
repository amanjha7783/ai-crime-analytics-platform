from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "AI-Driven Crime Analytics Platform")
    app_env: str = os.getenv("APP_ENV", "development")
    api_prefix: str = os.getenv("API_PREFIX", "/api")
    secret_key: str = os.getenv("SECRET_KEY", "change-this-in-production")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120"))
    backend_cors_origins: tuple[str, ...] = tuple(
        origin.strip()
        for origin in os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    )
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://crime_user:crime_password@localhost:5432/crime_ai",
    )
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    crime_data_path: str = os.getenv("CRIME_DATA_PATH", "data/processed/crimes_features.csv")
    use_database: bool = os.getenv("USE_DATABASE", "false").lower() in {"1", "true", "yes"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
