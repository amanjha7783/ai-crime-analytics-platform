from __future__ import annotations

from pathlib import Path

import pandas as pd

from backend.app.core.config import get_settings
from ml.prediction.engine import PredictionEngine


class CrimeDataRepository:
    """CSV-backed repository used for local demos and tests."""

    def __init__(self, data_path: str | None = None) -> None:
        settings = get_settings()
        self.data_path = Path(data_path or settings.crime_data_path)
        self.engine = PredictionEngine()

    def raw(self) -> pd.DataFrame:
        if not self.data_path.exists():
            raise FileNotFoundError(f"Crime data file not found: {self.data_path}")
        return pd.read_csv(self.data_path)

    def prepared(self) -> pd.DataFrame:
        return self.engine.prepare(self.raw())

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
