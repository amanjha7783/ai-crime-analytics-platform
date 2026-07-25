from __future__ import annotations

import pandas as pd


def summarize_crime_data(frame: pd.DataFrame) -> dict:
    """Return compact EDA metrics for API and reports."""
    return {
        "rows": int(len(frame)),
        "districts": sorted(frame["district"].dropna().unique().tolist()),
        "crime_types": frame["crime_type"].value_counts().to_dict(),
        "status_mix": frame["status"].value_counts().to_dict(),
        "date_range": {
            "start": str(pd.to_datetime(frame["reported_at"]).min().date()),
            "end": str(pd.to_datetime(frame["reported_at"]).max().date()),
        },
    }
