from pathlib import Path

import pandas as pd
from fastapi.testclient import TestClient

from backend.app.main import create_app
from etl.pipeline import run_etl_pipeline
from ml.training.pipeline import train_baseline_models


client = TestClient(create_app())


def test_search_endpoint_finds_fir_criminal_location_district_and_crime_type() -> None:
    for query, expected_key in [
        ("FIR-2026-0001", "fir_id"),
        ("OFF-1001", "offender_id"),
        ("Bengaluru Urban", "district"),
        ("Theft", "crime_type"),
        ("Central", "police_station"),
    ]:
        response = client.get("/api/search", params={"q": query})

        assert response.status_code == 200
        body = response.json()
        assert body["query"] == query
        assert body["total"] > 0
        assert expected_key in body["results"][0]


def test_socio_economic_endpoint_returns_correlation_rows() -> None:
    response = client.get("/api/analytics/socio-economic")

    assert response.status_code == 200
    body = response.json()
    assert body["factors"]
    assert {"district", "crime_count", "population_density", "income_category", "risk_score"}.issubset(
        body["factors"][0]
    )
    assert "insight" in body


def test_etl_pipeline_writes_processed_dataset(tmp_path: Path) -> None:
    raw_path = tmp_path / "raw.csv"
    processed_path = tmp_path / "processed.csv"
    pd.DataFrame(
        [
            {
                "fir_id": " FIR-9001 ",
                "crime_type": "theft",
                "district": "bengaluru urban",
                "police_station": "central",
                "reported_at": "2026-04-01 22:00:00",
                "latitude": 12.9716,
                "longitude": 77.5946,
                "status": "open",
                "offender_id": "OFF-9001",
                "victim_gender": "female",
                "victim_age": None,
                "weapon_used": "",
            }
        ]
    ).to_csv(raw_path, index=False)

    summary = run_etl_pipeline(raw_path, processed_path)

    assert processed_path.exists()
    assert summary["rows_processed"] == 1
    assert summary["features_created"] >= 10
    processed = pd.read_csv(processed_path)
    assert processed.loc[0, "district"] == "Bengaluru Urban"
    assert "risk_score" in processed.columns


def test_training_pipeline_returns_model_comparison_metrics() -> None:
    metrics = train_baseline_models(Path("data/processed/crimes_sample.csv"))

    assert metrics["models"]
    assert {"model", "task", "score", "features"}.issubset(metrics["models"][0])
    assert metrics["best_model"]["score"] >= 0
