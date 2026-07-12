import pandas as pd
import pytest

from ml.preprocessing.cleaning import clean_crime_data, handle_missing_values
from ml.preprocessing.features import engineer_features
from ml.preprocessing.validation import REQUIRED_COLUMNS, validate_crime_data


def _raw_frame() -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "fir_id": " FIR-001 ",
                "crime_type": "theft",
                "district": " bengaluru urban ",
                "police_station": "Central",
                "reported_at": "2026-01-15 21:15:00",
                "latitude": 12.9716,
                "longitude": 77.5946,
                "status": "Open",
                "offender_id": "OFF-001",
                "victim_gender": "Female",
                "victim_age": None,
                "weapon_used": "",
            }
        ]
    )


def test_validate_crime_data_rejects_missing_required_columns() -> None:
    frame = _raw_frame().drop(columns=["district"])

    with pytest.raises(ValueError) as error:
        validate_crime_data(frame)

    assert "district" in str(error.value)
    assert "required" in str(error.value).lower()


def test_cleaning_normalizes_text_and_imputes_missing_values() -> None:
    frame = validate_crime_data(_raw_frame())
    cleaned = clean_crime_data(frame)
    completed = handle_missing_values(cleaned)

    assert completed.loc[0, "fir_id"] == "FIR-001"
    assert completed.loc[0, "crime_type"] == "Theft"
    assert completed.loc[0, "district"] == "Bengaluru Urban"
    assert completed.loc[0, "weapon_used"] == "Unknown"
    assert completed.loc[0, "victim_age"] == 0


def test_engineer_features_adds_temporal_and_risk_columns() -> None:
    frame = handle_missing_values(clean_crime_data(validate_crime_data(_raw_frame())))

    engineered = engineer_features(frame)

    for column in [
        "crime_hour",
        "crime_day",
        "crime_month",
        "is_weekend",
        "season",
        "crime_frequency",
        "repeat_offender_count",
        "historical_hotspot_score",
        "risk_score",
    ]:
        assert column in engineered.columns

    assert engineered.loc[0, "crime_hour"] == 21
    assert 0 <= engineered.loc[0, "risk_score"] <= 100
    assert set(REQUIRED_COLUMNS).issubset(engineered.columns)
