from __future__ import annotations

from backend.app.core.config import get_settings
from backend.app.services.data_repository import CrimeDataRepository
from backend.app.services.postgis_repository import PostGISCrimeRepository


def get_crime_repository() -> CrimeDataRepository | PostGISCrimeRepository:
    settings = get_settings()
    if settings.use_database:
        return PostGISCrimeRepository(settings.database_url)
    return CrimeDataRepository(settings.crime_data_path)
