# AI-Driven Crime Analytics Platform Design

## Purpose

Build a production-style AI-powered crime analytics and visualization platform for Datathon 2026. The system turns fragmented police records into actionable intelligence for district analytics, crime maps, repeat offender analysis, hotspot prediction, trend forecasting, anomaly detection, explainable risk scoring, and operational reports.

## Scope

The full project is implemented in phases but the repository structure includes every requested module from the beginning:

- Data ingestion, validation, cleaning, missing-value handling, feature engineering, EDA, and PostgreSQL/PostGIS storage.
- ML pipeline for crime classification, hotspot prediction, repeat offender detection, risk scoring, trend forecasting, anomaly detection, and SHAP-compatible explainability.
- FastAPI REST API with dashboard, crime, prediction, hotspot, network, repeat offender, anomaly, report, and auth endpoints.
- Next.js dashboard with KPI views, interactive map-ready data, heatmap-ready feeds, crime trends, network graph data, risk scores, reports, and role-aware navigation.
- Docker setup for backend, frontend, PostgreSQL/PostGIS, and Redis.
- Documentation deliverables: architecture, workflow, flowchart, ER diagram, sequence diagram, use case diagram, class diagram, deployment guide, future scope, API notes, and presentation source.

## Phase Strategy

Phase 1 creates a runnable foundation:

- Monorepo folders matching the requested structure.
- FastAPI app with modular routers and deterministic demo data services.
- PostgreSQL/PostGIS schema and seed tooling.
- Role-based authentication primitives for Admin, Police Officer, Investigator, and Analyst.
- Next.js dashboard shell and pages for every requested frontend area.
- Docker Compose and local setup docs.
- Tests for the data pipeline, ML outputs, auth, and core API contracts.

Later phases replace deterministic demo services with trained model artifacts and database-backed repositories while keeping the same API contracts.

## Architecture

The platform uses a modular monorepo:

- `backend/app/api`: FastAPI routers and HTTP contracts.
- `backend/app/core`: settings, security, logging, and app setup.
- `backend/app/domain`: Pydantic domain schemas shared by API/services.
- `backend/app/services`: data access, analytics, auth, reporting, and ML orchestration facades.
- `ml`: reusable Python package for preprocessing, feature engineering, training, prediction, and explainability.
- `database`: SQL schema, migrations, and seed scripts.
- `frontend`: Next.js app router, reusable dashboard components, and typed API clients.
- `docs`: architecture and delivery documentation.

The first implementation reads a deterministic sample dataset from `data/processed/crimes_sample.csv` so local tests and demos do not require PostgreSQL. The database schema and Docker Compose are still included so the same data model can run on PostGIS in deployment.

## Data Flow

1. Raw crime data lands in `data/raw`.
2. ETL validates required fields, normalizes district/station/crime values, imputes missing values, engineers temporal/geospatial/risk features, and writes processed data.
3. Database seed scripts load processed rows into PostgreSQL/PostGIS.
4. ML modules train or compute classification, hotspot, repeat offender, risk, trend, anomaly, and explainability outputs.
5. FastAPI exposes those outputs via stable endpoints.
6. Next.js consumes API contracts for dashboards, maps, charts, graph views, reports, and filters.

## API Design

Required API prefixes:

- `/api/health`
- `/api/login`
- `/api/dashboard`
- `/api/crimes`
- `/api/predictions`
- `/api/hotspots`
- `/api/network`
- `/api/repeat-offenders`
- `/api/anomalies`
- `/api/reports`

All list endpoints accept common filters where relevant: district, crime type, police station, date range, gender, age band, status, and year.

## Frontend Design

The UI is an operational police intelligence portal, not a marketing page. It uses a dense, scan-friendly layout with:

- Left navigation for Dashboard, Crime Map, Analytics, Network Analysis, Predictions, Hotspots, Repeat Offenders, Reports, and Settings.
- KPI tiles for total crimes, active cases, solved cases, repeat offenders, high-risk zones, and district ranking.
- Chart-ready sections for trends, crime mix, anomalies, and district comparisons.
- Map-ready views using latitude/longitude and hotspot confidence data.
- Network graph-ready views using nodes and edges returned by the API.
- Report views with export-ready cards and summary narratives.

## Error Handling

Backend endpoints return structured errors with clear HTTP status codes. Services avoid hidden crashes by validating input filters and providing deterministic fallbacks when optional heavy ML libraries are unavailable.

## Testing

Tests cover:

- Data validation, cleaning, missing-value handling, and feature engineering.
- ML facade output shape for hotspots, risk scores, anomalies, trends, repeat offenders, and network graph data.
- FastAPI health, login, dashboard, and key API contract endpoints.
- Database schema presence for required tables and PostGIS geometry columns.

## Deployment

Docker Compose provides local deployment with:

- PostgreSQL/PostGIS
- Redis
- FastAPI backend
- Next.js frontend

Docs describe Vercel frontend deployment and Render/Railway backend deployment.

## Non-Goals For First Slice

- Real confidential police data ingestion.
- Production identity provider integration.
- Heavy model training with XGBoost, LightGBM, CatBoost, Prophet, or SHAP as mandatory runtime dependencies.

The code keeps extension points for those tools and uses lightweight deterministic/scikit-learn-compatible implementations for local repeatability.
