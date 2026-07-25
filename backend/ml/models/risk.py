from __future__ import annotations

import pandas as pd


def score_crimes(frame: pd.DataFrame) -> list[dict]:
    columns = ["fir_id", "district", "crime_type", "risk_score", "risk_level", "historical_hotspot_score"]
    return frame[columns].sort_values("risk_score", ascending=False).to_dict("records")
