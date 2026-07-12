import pandas as pd

from ml.prediction.engine import PredictionEngine


def _frame() -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "fir_id": "FIR-001",
                "crime_type": "Theft",
                "district": "Bengaluru Urban",
                "police_station": "Central",
                "reported_at": "2026-01-15 21:15:00",
                "latitude": 12.9716,
                "longitude": 77.5946,
                "status": "Open",
                "offender_id": "OFF-001",
                "victim_gender": "Female",
                "victim_age": 28,
                "weapon_used": "None",
            },
            {
                "fir_id": "FIR-002",
                "crime_type": "Assault",
                "district": "Mysuru",
                "police_station": "Lashkar",
                "reported_at": "2026-01-16 23:30:00",
                "latitude": 12.2958,
                "longitude": 76.6394,
                "status": "Under Investigation",
                "offender_id": "OFF-001",
                "victim_gender": "Male",
                "victim_age": 34,
                "weapon_used": "Knife",
            },
            {
                "fir_id": "FIR-003",
                "crime_type": "Cyber Crime",
                "district": "Bengaluru Urban",
                "police_station": "Whitefield",
                "reported_at": "2026-01-17 10:00:00",
                "latitude": 12.9698,
                "longitude": 77.7499,
                "status": "Solved",
                "offender_id": "OFF-002",
                "victim_gender": "Female",
                "victim_age": 41,
                "weapon_used": "Digital",
            },
        ]
    )


def test_prediction_engine_returns_all_intelligence_outputs() -> None:
    engine = PredictionEngine()

    output = engine.run(_frame())

    assert output.hotspots
    assert output.repeat_offenders[0]["offender_id"] == "OFF-001"
    assert output.risk_scores
    assert output.trends
    assert output.anomalies
    assert output.explanations["global_importance"]
    assert output.network["nodes"]
    assert output.network["edges"]


def test_hotspot_prediction_contains_confidence_and_coordinates() -> None:
    engine = PredictionEngine()

    hotspots = engine.run(_frame()).hotspots

    assert {"district", "latitude", "longitude", "confidence", "risk_level"}.issubset(
        hotspots[0].keys()
    )
    assert 0 <= hotspots[0]["confidence"] <= 1
