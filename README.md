# AI-Driven Crime Analytics and Visualization Platform

Production-style crime intelligence platform for Datathon 2026, designed around Karnataka State Police workflows. The project combines ETL, geospatial storage, ML-driven intelligence, explainability, FastAPI APIs, and a Next.js operational dashboard.

## Modules

- Crime dashboard with KPIs, district ranking, trend graphs, alerts, and crime mix.
- GIS crime map with hotspot and heatmap-ready coordinates.
- Hotspot prediction with confidence and risk level.
- Criminal network analysis with offender-district graph data.
- Repeat offender detection with timeline-ready records.
- Predictive risk scoring from crime type, repeat count, temporal context, and hotspot history.
- Trend forecasting, anomaly detection, and explainable AI feature importance.
- Role-aware authentication for Admin, Police Officer, Investigator, and Analyst.
- Unified search across FIR, offender, district, police station, location, and crime type.
- Socio-economic correlation analysis for district-level risk interpretation.

## Structure

```text
frontend/                 Next.js + Tailwind + TypeScript
backend/                  FastAPI service
ml/                       Preprocessing, models, prediction, explainability, training
database/                 PostgreSQL/PostGIS schema and seed tooling
data/                     Raw and processed data
docs/                     Architecture, diagrams, deployment, API, presentation
docker/                   Dockerfiles
scripts/                  Utility scripts
tests/                    Python tests
```

## Quick Start

```bash
python -m pip install -r requirements.txt
python -m pytest -q
python scripts/run_etl.py
python scripts/train_models.py
uvicorn backend.app.main:app --reload
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

- Backend API docs: `http://localhost:8000/docs`
- Frontend dashboard: `http://localhost:3000`

## Demo Users

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin@ksp.local` | `admin123` |
| Police Officer | `officer@ksp.local` | `officer123` |
| Investigator | `investigator@ksp.local` | `investigator123` |
| Analyst | `analyst@ksp.local` | `analyst123` |

## Docker

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- PostgreSQL/PostGIS: `localhost:5432`
- Redis: `localhost:6379`

## Verification

Current checks:

```bash
python -m pytest -q
python -m compileall backend ml database scripts
cd frontend
npm audit --audit-level=moderate
npm run build
```

## Data

The current repository includes deterministic Karnataka-style demo data in `data/processed/crimes_sample.csv`. Real police data can be added to `data/raw/` and routed through the ETL modules before database seeding.

## Documentation

- [Architecture](docs/architecture.md)
- [API](docs/api.md)
- [Deployment](docs/deployment.md)
- [Diagrams](docs/diagrams.md)
- [Future Scope](docs/future-scope.md)
- [Presentation Source](docs/presentation.md)
- [Deliverables Checklist](docs/deliverables.md)
