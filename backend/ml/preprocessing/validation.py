from __future__ import annotations

from typing import Iterable

import pandas as pd


REQUIRED_COLUMNS: tuple[str, ...] = (
    "fir_id",
    "crime_type",
    "district",
    "police_station",
    "reported_at",
    "latitude",
    "longitude",
    "status",
    "offender_id",
    "victim_gender",
    "victim_age",
    "weapon_used",
)


def validate_crime_data(frame: pd.DataFrame, required: Iterable[str] = REQUIRED_COLUMNS) -> pd.DataFrame:
    """Validate core crime-record columns and parse known data types."""
    missing = [column for column in required if column not in frame.columns]
    if missing:
        joined = ", ".join(missing)
        raise ValueError(f"Crime data is missing required column(s): {joined}")

    validated = frame.copy()
    validated["reported_at"] = pd.to_datetime(validated["reported_at"], errors="coerce")
    if validated["reported_at"].isna().any():
        raise ValueError("Crime data contains invalid reported_at values")

    for column in ["latitude", "longitude", "victim_age"]:
        validated[column] = pd.to_numeric(validated[column], errors="coerce")

    return validated
