from __future__ import annotations

import numpy as np
import pandas as pd


def _season(month: int) -> str:
    if month in {12, 1, 2}:
        return "Winter"
    if month in {3, 4, 5}:
        return "Summer"
    if month in {6, 7, 8, 9}:
        return "Monsoon"
    return "Post-Monsoon"


def engineer_features(frame: pd.DataFrame) -> pd.DataFrame:
    """Create temporal, repeat-offender, hotspot, and risk-score features."""
    engineered = frame.copy()
    engineered["reported_at"] = pd.to_datetime(engineered["reported_at"])
    engineered["crime_hour"] = engineered["reported_at"].dt.hour
    engineered["crime_day"] = engineered["reported_at"].dt.day
    engineered["crime_month"] = engineered["reported_at"].dt.month
    engineered["crime_year"] = engineered["reported_at"].dt.year
    engineered["is_weekend"] = engineered["reported_at"].dt.dayofweek.isin([5, 6]).astype(int)
    engineered["festival"] = engineered["reported_at"].dt.strftime("%m-%d").isin({"01-14", "08-15", "10-02"}).astype(int)
    engineered["season"] = engineered["crime_month"].map(_season)
    engineered["income_category"] = np.where(
        engineered["district"].str.contains("Bengaluru|Mysuru", case=False, na=False),
        "High",
        "Medium",
    )
    engineered["population_density"] = np.where(
        engineered["district"].str.contains("Bengaluru", case=False, na=False),
        12000,
        4500,
    )

    district_frequency = engineered.groupby("district")["fir_id"].transform("count")
    offender_frequency = engineered.groupby("offender_id")["fir_id"].transform("count")
    engineered["crime_frequency"] = district_frequency
    engineered["repeat_offender_count"] = offender_frequency

    engineered = engineered.sort_values("reported_at").reset_index(drop=True)
    engineered["time_since_last_crime"] = (
        engineered.groupby("district")["reported_at"].diff().dt.total_seconds().div(3600).fillna(999)
    )
    engineered["previous_crimes_nearby"] = np.maximum(district_frequency - 1, 0)
    engineered["distance_from_police_station"] = np.round(
        np.sqrt((engineered["latitude"] - engineered["latitude"].round(1)) ** 2 + (engineered["longitude"] - engineered["longitude"].round(1)) ** 2)
        * 111,
        2,
    )
    max_frequency = max(float(district_frequency.max()), 1.0)
    engineered["historical_hotspot_score"] = np.round((district_frequency / max_frequency) * 100, 2)

    severity = engineered["crime_type"].map(
        {
            "Theft": 35,
            "Cyber Crime": 45,
            "Burglary": 55,
            "Assault": 65,
            "Robbery": 75,
            "Drug Trafficking": 85,
        }
    ).fillna(40)
    night_factor = np.where((engineered["crime_hour"] >= 20) | (engineered["crime_hour"] <= 5), 10, 0)
    repeat_factor = np.minimum(engineered["repeat_offender_count"] * 7, 20)
    hotspot_factor = engineered["historical_hotspot_score"] * 0.2
    engineered["risk_score"] = np.clip(severity + night_factor + repeat_factor + hotspot_factor, 0, 100).round(2)
    engineered["risk_level"] = pd.cut(
        engineered["risk_score"],
        bins=[-1, 39, 69, 100],
        labels=["Low", "Medium", "High"],
    ).astype(str)

    return engineered
