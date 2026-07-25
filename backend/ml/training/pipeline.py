from __future__ import annotations

from pathlib import Path

import pandas as pd
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

from ml.prediction.engine import PredictionEngine


FEATURE_COLUMNS = [
    "latitude",
    "longitude",
    "crime_hour",
    "crime_month",
    "is_weekend",
    "population_density",
    "previous_crimes_nearby",
    "distance_from_police_station",
    "repeat_offender_count",
    "historical_hotspot_score",
]


def _classification_metric(frame: pd.DataFrame) -> dict:
    encoded = frame.copy()
    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(encoded["crime_type"])
    x = encoded[FEATURE_COLUMNS]

    model = RandomForestClassifier(n_estimators=50, random_state=42)
    if len(set(y)) < 2 or len(encoded) < 50:
        model.fit(x, y)
        score = accuracy_score(y, model.predict(x))
        validation_note = "fit_sanity_score_for_small_demo_dataset"
    else:
        x_train, x_test, y_train, y_test = train_test_split(
            x,
            y,
            test_size=0.3,
            random_state=42,
            stratify=None,
        )
        model.fit(x_train, y_train)
        score = accuracy_score(y_test, model.predict(x_test))
        validation_note = "holdout_accuracy"

    return {
        "model": "RandomForestClassifier",
        "task": "crime_classification",
        "score": round(float(score), 3),
        "features": FEATURE_COLUMNS,
        "validation_note": validation_note,
    }


def _anomaly_metric(frame: pd.DataFrame) -> dict:
    model = IsolationForest(random_state=42, contamination=min(0.2, max(0.05, 1 / len(frame))))
    labels = model.fit_predict(frame[FEATURE_COLUMNS])
    anomaly_ratio = (labels == -1).sum() / len(labels)
    return {
        "model": "IsolationForest",
        "task": "anomaly_detection",
        "score": round(float(1 - anomaly_ratio), 3),
        "features": FEATURE_COLUMNS,
    }


def train_baseline_models(data_path: str | Path) -> dict:
    """Train lightweight baseline models and return comparison metrics."""
    frame = PredictionEngine().prepare(pd.read_csv(data_path))
    models = [
        _classification_metric(frame),
        _anomaly_metric(frame),
        {
            "model": "HotspotHeuristic",
            "task": "hotspot_prediction",
            "score": round(float(frame["historical_hotspot_score"].mean() / 100), 3),
            "features": ["district", "latitude", "longitude", "historical_hotspot_score"],
        },
        {
            "model": "RiskScoringModel",
            "task": "risk_scoring",
            "score": round(float(frame["risk_score"].mean() / 100), 3),
            "features": ["crime_type", "repeat_offender_count", "crime_hour", "historical_hotspot_score"],
        },
    ]
    best_model = max(models, key=lambda item: item["score"])
    return {
        "dataset": str(data_path),
        "rows": int(len(frame)),
        "models": models,
        "best_model": best_model,
        "optional_heavy_models": [
            {"model": "XGBoost", "status": "available via requirements-ml-heavy.txt"},
            {"model": "LightGBM", "status": "available via requirements-ml-heavy.txt"},
            {"model": "CatBoost", "status": "available via requirements-ml-heavy.txt"},
            {"model": "Prophet", "status": "available via requirements-ml-heavy.txt"},
            {"model": "SHAP", "status": "available via requirements-ml-heavy.txt"},
        ],
    }
