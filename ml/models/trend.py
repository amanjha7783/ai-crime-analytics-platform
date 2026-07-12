from __future__ import annotations

import pandas as pd


def forecast_trends(frame: pd.DataFrame) -> list[dict]:
    dated = frame.copy()
    dated["reported_at"] = pd.to_datetime(dated["reported_at"])
    monthly = dated.groupby(dated["reported_at"].dt.to_period("M")).size().reset_index(name="crime_count")
    monthly["period"] = monthly["reported_at"].astype(str)
    records = monthly[["period", "crime_count"]].to_dict("records")

    if records:
        last_count = records[-1]["crime_count"]
        records.append({"period": "forecast-next-month", "crime_count": int(round(last_count * 1.08))})
    return records
