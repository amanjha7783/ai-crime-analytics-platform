from __future__ import annotations

from dataclasses import dataclass

import pandas as pd

from ml.explainability.shap_explainer import explain_predictions
from ml.models.anomaly import detect_anomalies
from ml.models.classification import classify_crime_patterns
from ml.models.hotspot import predict_hotspots
from ml.models.network import build_criminal_network
from ml.models.repeat_offender import detect_repeat_offenders
from ml.models.risk import score_crimes
from ml.models.trend import forecast_trends
from ml.preprocessing.cleaning import clean_crime_data, handle_missing_values
from ml.preprocessing.features import engineer_features
from ml.preprocessing.validation import validate_crime_data


@dataclass(frozen=True)
class PredictionOutput:
    classifications: list[dict]
    hotspots: list[dict]
    repeat_offenders: list[dict]
    risk_scores: list[dict]
    trends: list[dict]
    anomalies: list[dict]
    explanations: dict
    network: dict


class PredictionEngine:
    """Runs the end-to-end lightweight intelligence pipeline."""

    def prepare(self, frame: pd.DataFrame) -> pd.DataFrame:
        validated = validate_crime_data(frame)
        cleaned = clean_crime_data(validated)
        completed = handle_missing_values(cleaned)
        return engineer_features(completed)

    def run(self, frame: pd.DataFrame) -> PredictionOutput:
        prepared = self.prepare(frame)
        return PredictionOutput(
            classifications=classify_crime_patterns(prepared),
            hotspots=predict_hotspots(prepared),
            repeat_offenders=detect_repeat_offenders(prepared),
            risk_scores=score_crimes(prepared),
            trends=forecast_trends(prepared),
            anomalies=detect_anomalies(prepared),
            explanations=explain_predictions(prepared),
            network=build_criminal_network(prepared),
        )
