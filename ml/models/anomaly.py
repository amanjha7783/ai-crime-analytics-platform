from __future__ import annotations

import pandas as pd


def detect_anomalies(frame: pd.DataFrame) -> list[dict]:
    daily = frame.copy()
    daily["reported_date"] = pd.to_datetime(daily["reported_at"]).dt.date
    grouped = daily.groupby(["district", "reported_date"]).size().reset_index(name="crime_count")
    mean_count = grouped["crime_count"].mean()
    std_count = grouped["crime_count"].std() or 0
    threshold = mean_count + max(std_count * 1.5, 1)

    anomalies = grouped[grouped["crime_count"] >= threshold]
    if anomalies.empty:
        anomalies = grouped.sort_values("crime_count", ascending=False).head(3)

    return [
        {
            "district": row["district"],
            "date": str(row["reported_date"]),
            "crime_count": int(row["crime_count"]),
            "severity": "High" if row["crime_count"] >= threshold else "Watch",
            "message": f"Unusual activity pattern detected in {row['district']}",
        }
        for row in anomalies.to_dict("records")
    ]
