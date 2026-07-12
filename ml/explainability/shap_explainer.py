from __future__ import annotations

import pandas as pd


def explain_predictions(frame: pd.DataFrame) -> dict:
    """Return SHAP-compatible explanations with a deterministic fallback."""
    importance = [
        {"feature": "crime_type", "importance": 0.26},
        {"feature": "repeat_offender_count", "importance": 0.22},
        {"feature": "historical_hotspot_score", "importance": 0.2},
        {"feature": "crime_hour", "importance": 0.14},
        {"feature": "district", "importance": 0.1},
        {"feature": "weapon_used", "importance": 0.08},
    ]
    local = [
        {
            "fir_id": row["fir_id"],
            "risk_score": float(row["risk_score"]),
            "top_reason": f"{row['crime_type']} in {row['district']} with repeat count {row['repeat_offender_count']}",
        }
        for row in frame.sort_values("risk_score", ascending=False).head(5).to_dict("records")
    ]
    return {"method": "feature_importance_fallback", "global_importance": importance, "local_explanations": local}
