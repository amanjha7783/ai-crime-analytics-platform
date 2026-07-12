from __future__ import annotations

import pandas as pd


def classify_crime_patterns(frame: pd.DataFrame) -> list[dict]:
    grouped = (
        frame.groupby(["district", "crime_type"])
        .agg(count=("fir_id", "count"), average_risk=("risk_score", "mean"))
        .reset_index()
        .sort_values(["district", "count"], ascending=[True, False])
    )
    return [
        {
            "district": row["district"],
            "predicted_crime_type": row["crime_type"],
            "confidence": round(min(0.98, 0.5 + (row["count"] * 0.08)), 3),
            "average_risk": round(float(row["average_risk"]), 2),
        }
        for row in grouped.to_dict("records")
    ]
