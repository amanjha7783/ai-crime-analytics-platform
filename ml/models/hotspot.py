from __future__ import annotations

import pandas as pd


def predict_hotspots(frame: pd.DataFrame) -> list[dict]:
    grouped = (
        frame.groupby("district")
        .agg(
            crime_count=("fir_id", "count"),
            mean_risk=("risk_score", "mean"),
            latitude=("latitude", "mean"),
            longitude=("longitude", "mean"),
        )
        .reset_index()
        .sort_values(["mean_risk", "crime_count"], ascending=False)
    )
    max_count = max(float(grouped["crime_count"].max()), 1.0)
    hotspots: list[dict] = []
    for row in grouped.to_dict("records"):
        confidence = min(1.0, ((row["crime_count"] / max_count) * 0.55) + (row["mean_risk"] / 100 * 0.45))
        hotspots.append(
            {
                "district": row["district"],
                "crime_count": int(row["crime_count"]),
                "latitude": round(float(row["latitude"]), 5),
                "longitude": round(float(row["longitude"]), 5),
                "confidence": round(float(confidence), 3),
                "risk_level": "High" if confidence >= 0.7 else "Medium" if confidence >= 0.4 else "Low",
            }
        )
    return hotspots
