# Crime AI Platform Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable foundation for the AI-Driven Crime Analytics and Visualization Platform while preserving all requested modules.

**Architecture:** Create a monorepo with FastAPI, reusable ML/ETL Python packages, PostgreSQL/PostGIS schema, Docker Compose, and a Next.js dashboard shell. Use deterministic sample data so API tests and demos run without external police data or a local database.

**Tech Stack:** FastAPI, Pydantic, pandas, scikit-learn-compatible Python modules, PostgreSQL/PostGIS SQL, Redis, Next.js, TypeScript, Tailwind CSS, Recharts, Leaflet-ready data contracts, Docker.

---

## File Structure

- `backend/app/main.py`: FastAPI app factory and router registration.
- `backend/app/core/config.py`: Environment-driven settings.
- `backend/app/core/security.py`: Password verification and JWT-style demo token helpers.
- `backend/app/domain/schemas.py`: API response models.
- `backend/app/services/data_repository.py`: CSV-backed repository with filters.
- `backend/app/services/analytics_service.py`: Dashboard, trend, hotspot, anomaly, network, repeat offender, risk, and report calculations.
- `backend/app/services/auth_service.py`: Role-based demo users.
- `backend/app/api/*.py`: HTTP routers.
- `ml/preprocessing/*.py`: Validation, cleaning, feature engineering, and EDA helpers.
- `ml/models/*.py`: Lightweight model interfaces for classification, hotspot, anomaly, trend, repeat offender, and risk scoring.
- `ml/prediction/engine.py`: Combined prediction facade.
- `ml/explainability/shap_explainer.py`: SHAP-compatible explanation facade with feature-importance fallback.
- `database/schema.sql`: PostgreSQL/PostGIS schema.
- `database/seed.py`: CSV-to-Postgres seed script.
- `data/processed/crimes_sample.csv`: Deterministic Karnataka-style demo data.
- `frontend/app/**`: Next.js pages and layout.
- `frontend/components/**`: Dashboard UI components.
- `frontend/lib/api.ts`: Typed backend client and fallback demo data.
- `docker-compose.yml`, `docker/backend.Dockerfile`, `docker/frontend.Dockerfile`: Local deployment.
- `docs/*.md`: Architecture, diagrams, deployment, API, and presentation deliverables.
- `tests/*.py`: Repository-level tests for data, ML, API, and schema.

## Tasks

### Task 1: Project Metadata And Data

**Files:**
- Create: `.gitignore`
- Create: `requirements.txt`
- Create: `requirements-ml-heavy.txt`
- Create: `.env.example`
- Create: `data/processed/crimes_sample.csv`

- [ ] Add Python, Node, Docker, and environment ignores.
- [ ] Add core Python dependencies used by the runnable app and tests.
- [ ] Add optional heavy ML dependencies separately.
- [ ] Add deterministic crime sample rows covering districts, stations, crime types, offenders, coordinates, statuses, and dates.
- [ ] Verify `python -m compileall backend ml database scripts` after implementation.

### Task 2: ETL And ML Foundation

**Files:**
- Create: `ml/preprocessing/validation.py`
- Create: `ml/preprocessing/cleaning.py`
- Create: `ml/preprocessing/features.py`
- Create: `ml/preprocessing/eda.py`
- Create: `ml/models/*.py`
- Create: `ml/prediction/engine.py`
- Create: `ml/explainability/shap_explainer.py`
- Create: `tests/test_data_pipeline.py`
- Create: `tests/test_ml_engine.py`

- [ ] Write tests for required-column validation, missing-value handling, feature creation, and prediction output shapes.
- [ ] Run tests and confirm they fail before implementation.
- [ ] Implement preprocessing and ML facade modules.
- [ ] Re-run tests and confirm they pass.

### Task 3: Backend API

**Files:**
- Create: `backend/app/main.py`
- Create: `backend/app/core/config.py`
- Create: `backend/app/core/security.py`
- Create: `backend/app/domain/schemas.py`
- Create: `backend/app/services/*.py`
- Create: `backend/app/api/*.py`
- Create: `tests/test_api.py`

- [ ] Write API tests for health, login, dashboard, crimes, hotspots, network, repeat offenders, anomalies, predictions, and reports.
- [ ] Run tests and confirm they fail before implementation.
- [ ] Implement FastAPI routers and services.
- [ ] Re-run tests and confirm they pass.

### Task 4: Database And Seed Tooling

**Files:**
- Create: `database/schema.sql`
- Create: `database/migrations/001_initial.sql`
- Create: `database/seed.py`
- Create: `tests/test_database_schema.py`

- [ ] Write schema tests that assert required tables and PostGIS geometry usage are present.
- [ ] Run tests and confirm they fail before implementation.
- [ ] Implement schema, migration, and seed script.
- [ ] Re-run tests and confirm they pass.

### Task 5: Frontend Dashboard

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/next.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/postcss.config.js`
- Create: `frontend/app/layout.tsx`
- Create: `frontend/app/page.tsx`
- Create: `frontend/app/**/page.tsx`
- Create: `frontend/components/*.tsx`
- Create: `frontend/lib/api.ts`

- [ ] Build a responsive operational dashboard shell.
- [ ] Add pages for Dashboard, Crime Map, Analytics, Network Analysis, Predictions, Hotspots, Repeat Offenders, Reports, and Settings.
- [ ] Use typed data contracts and local fallback data.
- [ ] Verify with `npm install` and `npm run build` when network and package installation are available.

### Task 6: Docker And Documentation

**Files:**
- Create: `docker-compose.yml`
- Create: `docker/backend.Dockerfile`
- Create: `docker/frontend.Dockerfile`
- Create: `README.md`
- Create: `docs/api.md`
- Create: `docs/architecture.md`
- Create: `docs/deployment.md`
- Create: `docs/diagrams.md`
- Create: `docs/future-scope.md`
- Create: `docs/presentation.md`
- Create: `scripts/generate_presentation.py`

- [ ] Add Docker services for backend, frontend, PostgreSQL/PostGIS, and Redis.
- [ ] Document local setup, API usage, deployment, diagrams, and future scope.
- [ ] Add a PowerPoint generator script using `python-pptx` when installed.
- [ ] Verify documentation has no incomplete markers.

### Task 7: Verification

**Files:**
- Modify as needed based on verification output.

- [ ] Run `python -m pip install -r requirements.txt`.
- [ ] Run `python -m pytest -q`.
- [ ] Run `python -m compileall backend ml database scripts`.
- [ ] Run `npm install` in `frontend`.
- [ ] Run `npm run build` in `frontend`.
- [ ] Report exact verification results and any remaining gaps.
