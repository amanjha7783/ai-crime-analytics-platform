from __future__ import annotations

import pandas as pd


TITLE_CASE_COLUMNS = ("crime_type", "district", "police_station", "status", "victim_gender")


def _clean_text(value: object) -> str:
    if value is None or pd.isna(value):
        return ""
    return str(value).strip()


def clean_crime_data(frame: pd.DataFrame) -> pd.DataFrame:
    """Normalize textual fields and remove duplicate FIR rows."""
    cleaned = frame.copy()
    cleaned["fir_id"] = cleaned["fir_id"].map(_clean_text)
    cleaned["offender_id"] = cleaned["offender_id"].map(_clean_text)
    cleaned["weapon_used"] = cleaned["weapon_used"].map(_clean_text)

    for column in TITLE_CASE_COLUMNS:
        cleaned[column] = cleaned[column].map(lambda value: _clean_text(value).title())

    cleaned = cleaned.drop_duplicates(subset=["fir_id"]).reset_index(drop=True)
    return cleaned


def handle_missing_values(frame: pd.DataFrame) -> pd.DataFrame:
    """Impute missing values with deterministic defaults for repeatable demos."""
    completed = frame.copy()
    completed["victim_age"] = completed["victim_age"].fillna(0).astype(int)
    completed["weapon_used"] = completed["weapon_used"].replace("", "Unknown").fillna("Unknown")
    completed["victim_gender"] = completed["victim_gender"].replace("", "Unknown").fillna("Unknown")
    completed["offender_id"] = completed["offender_id"].replace("", "UNKNOWN").fillna("UNKNOWN")

    for column in ["latitude", "longitude"]:
        mean_value = completed[column].mean()
        completed[column] = completed[column].fillna(mean_value if pd.notna(mean_value) else 0.0)

    return completed
