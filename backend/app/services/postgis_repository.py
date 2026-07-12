from __future__ import annotations

import pandas as pd
from sqlalchemy import create_engine, text

from backend.app.core.config import get_settings
from ml.prediction.engine import PredictionEngine


class PostGISCrimeRepository:
    """PostgreSQL/PostGIS-backed repository for deployed environments."""

    def __init__(self, database_url: str | None = None) -> None:
        settings = get_settings()
        self.database_url = database_url or settings.database_url
        self.engine = create_engine(self.database_url)
        self.prediction_engine = PredictionEngine()

    def raw(self) -> pd.DataFrame:
        query = text(
            """
            SELECT
                c.fir_id,
                c.crime_type,
                d.name AS district,
                ps.name AS police_station,
                c.reported_at,
                ST_Y(c.location) AS latitude,
                ST_X(c.location) AS longitude,
                c.status,
                o.offender_code AS offender_id,
                c.victim_gender,
                c.victim_age,
                c.weapon_used
            FROM crimes c
            JOIN districts d ON d.id = c.district_id
            JOIN police_stations ps ON ps.id = c.police_station_id
            LEFT JOIN crime_offenders co ON co.crime_id = c.id
            LEFT JOIN offenders o ON o.id = co.offender_id
            ORDER BY c.reported_at DESC
            """
        )
        return pd.read_sql(query, self.engine)

    def prepared(self) -> pd.DataFrame:
        return self.prediction_engine.prepare(self.raw())

    def filtered(self, **filters: object) -> pd.DataFrame:
        frame = self.prepared()
        for column, value in filters.items():
            if value in (None, "") or column not in frame.columns:
                continue
            if column == "year":
                frame = frame[frame["crime_year"] == int(value)]
            else:
                frame = frame[frame[column].astype(str).str.lower() == str(value).lower()]
        return frame.reset_index(drop=True)
