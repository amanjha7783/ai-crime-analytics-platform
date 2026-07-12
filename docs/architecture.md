# Architecture

## System Overview

The platform is a modular monorepo that separates data engineering, ML intelligence, API delivery, and user experience.

```text
Police Crime Data
        |
        v
ETL / Data Pipeline
        |
        +--> PostgreSQL + PostGIS
        |
        +--> ML Pipeline
                  |
                  +--> Prediction Engine
                  +--> Anomaly Detection
                  +--> Explainability
        |
        v
FastAPI Backend
        |
        +--> Dashboard
        +--> Crime Maps
        +--> Network Analysis
        +--> Reports
        |
        v
Police Intelligence Portal
```

## Backend

FastAPI exposes stable contracts under `/api`. The app uses a CSV-backed repository for local repeatability by default and can switch to PostgreSQL/PostGIS with `USE_DATABASE=true`.

Key units:

- `backend/app/api`: HTTP routes.
- `backend/app/services`: business logic and orchestration.
- `backend/app/core`: configuration and security helpers.
- `backend/app/domain`: Pydantic request and response models.

## ML And ETL

The `ml` package follows the requested pipeline:

1. Data validation.
2. Data cleaning.
3. Missing-value handling.
4. Feature engineering.
5. EDA summary.
6. Crime classification.
7. Hotspot prediction.
8. Repeat offender detection.
9. Risk scoring.
10. Trend forecasting.
11. Anomaly detection.
12. Explainability.

Heavy model libraries are listed in `requirements-ml-heavy.txt`; the default runtime uses deterministic local methods so tests are fast and reliable.

The `etl` package provides an executable orchestration layer. Use `python scripts/run_etl.py` to convert raw or staged CSV data into a processed feature dataset, and `python scripts/train_models.py` to generate model-comparison metrics.

## Frontend

The Next.js app is dashboard-first. It uses Tailwind CSS, Recharts, and typed API clients. The UI is built for operational scanning: dense KPI tiles, compact tables, trend charts, hotspot surfaces, graph-ready network views, and report pages.

Operational surfaces include dashboard, unified search, crime map, heatmaps, analytics, network analysis, predictions, risk score, hotspots, repeat offenders, reports, login, settings, and a separate landing route.

## Database

PostgreSQL/PostGIS stores districts, stations, crimes, offenders, relationships, predictions, hotspots, alerts, users, and roles. Geometry columns support spatial indexing for crime and hotspot queries.
