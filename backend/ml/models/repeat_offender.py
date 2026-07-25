from __future__ import annotations

import pandas as pd


def detect_repeat_offenders(frame: pd.DataFrame) -> list[dict]:
    offenders = (
        frame.groupby("offender_id")
        .agg(
            crime_count=("fir_id", "count"),
            last_seen=("reported_at", "max"),
            districts=("district", lambda values: sorted(set(values))),
            crime_types=("crime_type", lambda values: sorted(set(values))),
            average_risk=("risk_score", "mean"),
        )
        .reset_index()
    )
    offenders = offenders[offenders["crime_count"] > 1].sort_values(
        ["crime_count", "average_risk"], ascending=False
    )
    return [
        {
            "offender_id": row["offender_id"],
            "crime_count": int(row["crime_count"]),
            "last_seen": str(pd.to_datetime(row["last_seen"]).date()),
            "districts": row["districts"],
            "crime_types": row["crime_types"],
            "risk_score": round(float(row["average_risk"]), 2),
        }
        for row in offenders.to_dict("records")
    ]
