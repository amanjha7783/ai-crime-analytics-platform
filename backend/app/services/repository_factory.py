from __future__ import annotations

from app.core.config import get_settings
from app.services.data_repository import CrimeDataRepository
from app.services.postgis_repository import PostGISCrimeRepository


def get_crime_repository() -> CrimeDataRepository | PostGISCrimeRepository:
    settings = get_settings()
    if settings.use_database:
        return PostGISCrimeRepository(settings.database_url)
    return CrimeDataRepository(settings.crime_data_path)
