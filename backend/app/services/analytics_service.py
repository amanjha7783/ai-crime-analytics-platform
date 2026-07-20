from __future__ import annotations

import pandas as pd

from backend.app.services.data_repository import CrimeDataRepository
from backend.app.services.postgis_repository import PostGISCrimeRepository
from backend.app.services.repository_factory import get_crime_repository
from ml.prediction.engine import PredictionEngine
from ml.preprocessing.eda import summarize_crime_data


class AnalyticsService:
    def __init__(self, repository: CrimeDataRepository | PostGISCrimeRepository | None = None) -> None:
        self.repository = repository or get_crime_repository()
        self.engine = PredictionEngine()

    def crimes(self, **filters: object) -> list[dict]:
        skip = filters.pop("skip", 0)
        limit = filters.pop("limit", 5000)
        frame = self.repository.filtered(**filters)
        sorted_frame = frame.sort_values("reported_at", ascending=False)
        return self._json_records(sorted_frame.iloc[skip:skip + limit])

    def search(self, query: str) -> dict:
        frame = self.repository.prepared()
        normalized = query.strip().lower()
        searchable_columns = ["fir_id", "offender_id", "district", "crime_type", "police_station", "status"]
        mask = False
        for column in searchable_columns:
            mask = mask | frame[column].astype(str).str.lower().str.contains(normalized, regex=False)
        results = frame[mask].sort_values("reported_at", ascending=False)
        return {"query": query, "total": int(len(results)), "results": self._json_records(results.head(25))}

    def socio_economic_correlation(self) -> dict:
        frame = self.repository.prepared()
        grouped = (
            frame.groupby("district")
            .agg(
                crime_count=("fir_id", "count"),
                population_density=("population_density", "mean"),
                income_category=("income_category", lambda values: values.mode().iloc[0]),
                risk_score=("risk_score", "mean"),
                high_risk_cases=("risk_level", lambda values: int((values == "High").sum())),
            )
            .reset_index()
            .sort_values("risk_score", ascending=False)
        )
        factors = [
            {
                "district": row["district"],
                "crime_count": int(row["crime_count"]),
                "population_density": round(float(row["population_density"]), 2),
                "income_category": row["income_category"],
                "risk_score": round(float(row["risk_score"]), 2),
                "high_risk_cases": int(row["high_risk_cases"]),
            }
            for row in grouped.to_dict("records")
        ]
        correlation = frame[["population_density", "risk_score"]].corr().iloc[0, 1]
        if pd.isna(correlation):
            correlation = 0.0
        return {
            "factors": factors,
            "correlation": round(float(correlation), 3),
            "insight": "Higher-density urban districts show stronger crime concentration in the current demo dataset.",
        }

    def dashboard(self) -> dict:
        frame = self.repository.prepared()
        predictions = self.engine.run(self.repository.raw())
        total = int(len(frame))
        active = int(frame["status"].isin(["Open", "Under Investigation"]).sum())
        solved = int((frame["status"] == "Solved").sum())
        repeat_count = len(predictions.repeat_offenders)
        high_risk_zones = sum(1 for item in predictions.hotspots if item["risk_level"] == "High")
        district_counts = frame["district"].value_counts().reset_index()
        district_counts.columns = ["district", "crime_count"]
        trend = (
            frame.assign(period=frame["reported_at"].dt.strftime("%Y-%m"))
            .groupby("period")
            .size()
            .reset_index(name="crime_count")
            .to_dict("records")
        )
        crime_mix = frame["crime_type"].value_counts().rename_axis("crime_type").reset_index(name="count")
        return {
            "kpis": {
                "total_crimes": total,
                "active_cases": active,
                "solved_cases": solved,
                "repeat_offenders": repeat_count,
                "high_risk_zones": high_risk_zones,
                "top_district": district_counts.iloc[0]["district"],
            },
            "district_ranking": district_counts.to_dict("records"),
            "trend": trend,
            "crime_mix": crime_mix.to_dict("records"),
            "alerts": predictions.anomalies[:5],
        }

    def hotspots(self) -> list[dict]:
        return self.engine.run(self.repository.raw()).hotspots

    def predictions(self) -> dict:
        output = self.engine.run(self.repository.raw())
        return {
            "classifications": output.classifications,
            "hotspots": output.hotspots,
            "risk_scores": output.risk_scores,
            "trend_forecast": output.trends,
            "explainability": output.explanations,
        }

    def network(self) -> dict:
        return self.engine.run(self.repository.raw()).network

    def repeat_offenders(self) -> list[dict]:
        return self.engine.run(self.repository.raw()).repeat_offenders

    def anomalies(self) -> list[dict]:
        return self.engine.run(self.repository.raw()).anomalies

    def report(self) -> dict:
        frame = self.repository.prepared()
        summary = summarize_crime_data(frame)
        dashboard = self.dashboard()
        socio = self.socio_economic_correlation()
        return {
            "title": "Karnataka Crime Intelligence Brief",
            "generated_for": "Karnataka State Police Datathon 2026",
            "summary": (
                f"Analyzed {summary['rows']} FIR records across "
                f"{len(summary['districts'])} districts with {dashboard['kpis']['repeat_offenders']} repeat offender clusters."
            ),
            "sections": [
                {"heading": "Operational KPIs", "data": dashboard["kpis"]},
                {"heading": "District Ranking", "data": dashboard["district_ranking"]},
                {"heading": "Anomaly Alerts", "data": dashboard["alerts"]},
                {"heading": "EDA Summary", "data": summary},
                {"heading": "Socio-Economic Correlation", "data": socio},
            ],
        }

    @staticmethod
    def _json_records(frame: pd.DataFrame) -> list[dict]:
        serializable = frame.copy()
        for column in serializable.select_dtypes(include=["datetime64[ns]"]).columns:
            serializable[column] = serializable[column].dt.strftime("%Y-%m-%d %H:%M:%S")
        return serializable.to_dict("records")
