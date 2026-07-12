from __future__ import annotations

from pathlib import Path

import pandas as pd

from ml.preprocessing.cleaning import clean_crime_data, handle_missing_values
from ml.preprocessing.features import engineer_features
from ml.preprocessing.validation import validate_crime_data


def run_etl_pipeline(raw_path: str | Path, processed_path: str | Path) -> dict:
    """Run validation, cleaning, missing-value handling, and feature engineering."""
    raw_path = Path(raw_path)
    processed_path = Path(processed_path)
    frame = pd.read_csv(raw_path)
    validated = validate_crime_data(frame)
    cleaned = clean_crime_data(validated)
    completed = handle_missing_values(cleaned)
    engineered = engineer_features(completed)

    processed_path.parent.mkdir(parents=True, exist_ok=True)
    engineered.to_csv(processed_path, index=False)

    return {
        "source": str(raw_path),
        "output": str(processed_path),
        "rows_processed": int(len(engineered)),
        "features_created": int(len(set(engineered.columns) - set(frame.columns))),
        "columns": engineered.columns.tolist(),
    }
