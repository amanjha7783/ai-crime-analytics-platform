# Repository Analysis Report

Generated: 2026-07-20

Scope: Analysis only. No implementation changes were made beyond creating this report.

## Existing Architecture

The project is a modular monorepo for an AI crime intelligence platform:

- `backend/`: FastAPI application with route modules, services, core configuration, and authentication helpers.
- `frontend/`: Next.js App Router dashboard with Tailwind CSS, Leaflet, Recharts, Lucide icons, and client-side interactive components.
- `ml/`: Python package for preprocessing, feature engineering, lightweight model outputs, prediction orchestration, explainability, and training metrics.
- `etl/`: CSV-oriented ETL orchestration.
- `database/`: PostgreSQL/PostGIS schema, migration, and seed tooling.
- `data/`: demo processed datasets and generated feature dataset.
- `docs/`: architecture, API, deployment, diagrams, deliverables, presentation material, and this analysis.
- `scripts/`: ETL, model training, presentation generation, and verification scripts.
- `tests/`: Python API, ETL, ML, and database schema tests.
- `tools/`: smoke scripts for API and ML sanity checks.
- `docker/` and `docker-compose.yml`: container definitions for backend, frontend, PostGIS, and Redis.

The current implementation uses a CSV-backed repository by default and can switch to a PostGIS-backed repository with `USE_DATABASE=true`.

## Folder Structure

Observed repository areas:

- `backend`: 22 files
- `frontend`: 35 files excluding dependency/build folders
- `ml`: 21 files
- `etl`: 2 files
- `database`: 3 files
- `docs`: 10 files before this report
- `scripts`: 4 files
- `tests`: 5 files
- `tools`: 2 files
- `data`: 3 files

Notable local/generated folders also exist: `.venv`, `.pytest_cache`, `logs`, and `database_local_data`.

Git status: nearly all project files are currently untracked. This means the repository has not yet been committed into a stable baseline.

## Backend Analysis

Backend entrypoint: `backend/app/main.py`.

Registered route modules:

- `health.py`
- `auth.py`
- `dashboard.py`
- `crimes.py`
- `intelligence.py`
- `search.py`
- `analytics.py`

Strengths:

- Clear route/service split.
- `create_app()` makes testing clean.
- CSV and PostGIS repository paths exist.
- Auth service supports demo users and database-backed users.
- Tests cover basic health, login, `/me`, dashboard, intelligence endpoints, ETL, training metrics, and schema.

Weaknesses:

- Most intelligence routes are not protected by `Depends(get_current_user)`.
- Services recompute the full prediction pipeline repeatedly for each request.
- API responses are mostly `dict` and `list[dict]`; only auth has stronger response models.
- No global error handler, request ID middleware, structured logging, or audit logging.
- No rate limiting.
- No pagination for `/api/crimes` or `/api/search`.
- No cache integration despite Redis being part of Docker Compose.

## Frontend Analysis

Frontend stack:

- Next.js 15 App Router
- React 19
- Tailwind CSS
- Leaflet
- Recharts
- Framer Motion dependency available
- Lucide React icons

Routes observed:

- `/`
- `/analytics`
- `/crime-map`
- `/heatmaps`
- `/hotspots`
- `/landing`
- `/login`
- `/network-analysis`
- `/predictions`
- `/repeat-offenders`
- `/reports`
- `/risk-score`
- `/search`
- `/settings`

Strengths:

- Broad page coverage for the requested feature areas.
- Reusable shell, stat card, section panel, table, search, login, chart, and map components.
- Leaflet map component exists for GIS pages.
- Dark/light theme variables and a theme toggle component exist.
- Production build passes.

Weaknesses:

- The root `/` route is now a landing page rather than the operational dashboard, which conflicts with the earlier dashboard-first architecture.
- `ThemeToggle` exists but does not appear to be integrated into the shell.
- Several filters are static UI controls and do not drive API queries.
- Network graph is a manually positioned node display, not a true interactive graph engine.
- Search and login are client components, but the API client fallback behavior can hide backend failures.
- Next build logs repeated API fetch failures when the backend is not running, then falls back to demo data.

## AI Models

Implemented modules:

- `ml/models/classification.py`
- `ml/models/hotspot.py`
- `ml/models/repeat_offender.py`
- `ml/models/risk.py`
- `ml/models/trend.py`
- `ml/models/anomaly.py`
- `ml/models/network.py`
- `ml/explainability/shap_explainer.py`
- `ml/training/pipeline.py`

Current model behavior:

- Classification is a district/crime grouping style output.
- Hotspot prediction is heuristic aggregation by district.
- Risk scoring is rule-based.
- Trend forecast is simple monthly aggregation with next-month projection.
- Anomaly detection is grouped-count thresholding in prediction mode and Isolation Forest in training metrics.
- Network analysis produces offender-district nodes and edges.
- Explainability is a deterministic feature-importance fallback.
- Training metrics include Random Forest and Isolation Forest plus heuristic model summaries.

Missing from full objective:

- DBSCAN hotspot clustering.
- KMeans hotspot clustering.
- Kernel Density Estimation.
- XGBoost, LightGBM, CatBoost training and comparison.
- Prophet forecasting implementation.
- Real SHAP explainer integration.
- Precision, recall, F1, ROC-AUC, confusion matrix, and cross-validation outputs.
- Model artifact persistence and loading.
- Model versioning.
- Dataset split strategy for realistic evaluation.

## Database Design

Database file: `database/schema.sql`.

Strengths:

- Enables `postgis` and `pgcrypto`.
- Includes police administration entities such as states, districts, units, ranks, employees, case categories, acts, sections, courts, case master, complainants, victims, accused, arrest/surrender, chargesheet details.
- Includes platform entities: users, roles, offenders, crimes, crime_offenders, predictions, hotspots, alerts.
- Uses geometry columns for police stations, crimes, hotspots, and district boundaries.
- Spatial indexes exist for crime locations, police station locations, and hotspot centers.

Weaknesses:

- `case_master` uses numeric latitude/longitude but no generated PostGIS point column.
- `crimes` and legacy `case_master` data models are parallel rather than unified.
- No audit log table.
- No refresh/job tracking tables for ETL/model runs.
- No report export table.
- No alert acknowledgement actor/timestamp details.
- No materialized views for dashboard performance.

## APIs

Current API surface:

- `GET /api/health`
- `POST /api/login`
- `GET /api/me`
- `GET /api/dashboard`
- `GET /api/crimes`
- `GET /api/hotspots`
- `GET /api/predictions`
- `GET /api/network`
- `GET /api/repeat-offenders`
- `GET /api/anomalies`
- `GET /api/reports`
- `GET /api/search`
- `GET /api/analytics/socio-economic`

Strengths:

- Covers the main dashboard/intelligence areas.
- FastAPI docs are available automatically.
- Query filters exist on `/api/crimes`.

Gaps:

- No APIs for PDF/Excel/CSV report generation.
- No chat assistant API.
- No map radius search API.
- No route mapping API.
- No animated playback/time-slider API.
- No station drilldown or district drilldown endpoints.
- No model training/job endpoints.
- No audit log APIs.
- No role-based route policies by endpoint.

## UI Components

Current reusable components:

- `dashboard-shell.tsx`
- `stat-card.tsx`
- `section-panel.tsx`
- `data-table.tsx`
- `trend-chart.tsx`
- `leaflet-crime-map.tsx`
- `hotspot-map.tsx`
- `search-console.tsx`
- `login-panel.tsx`
- `theme-toggle.tsx`

Strengths:

- Components are reusable and small.
- Maps and charts are isolated.
- Shell provides central navigation.

Gaps:

- No skeleton loading components.
- No advanced filter component shared across pages.
- No reusable KPI grid with live refresh state.
- No graph explorer component.
- No export controls.
- No command/search palette.
- No role-aware navigation state.

## Authentication

Current status:

- Demo and database-backed login paths exist.
- Token creation and verification exist.
- `/api/me` validates Authorization headers.
- Frontend stores token in `localStorage` through login flow.

Security concerns:

- Password hashing uses raw SHA-256 instead of bcrypt/Argon2.
- Default `SECRET_KEY` is insecure unless overridden.
- Most backend routes are not protected.
- RBAC roles exist but are not enforced on route access.
- Token format is custom HMAC rather than a standard JWT library.
- Frontend token storage in `localStorage` is vulnerable to XSS token theft.
- No audit log for login or intelligence access.

## GIS Features

Current status:

- Leaflet map component renders crime markers and hotspot circles.
- PostGIS schema supports geometry points and spatial indexes.
- Hotspot pages and heatmap pages use the same Leaflet map component.

Missing:

- Marker clustering.
- True heatmap layer.
- District polygon drilldown.
- Police station drilldown.
- Radius search.
- Route mapping.
- Satellite and terrain tile switching.
- Time slider and animated playback.
- Spatio-temporal hotspot models.

## Performance Issues

- Analytics service recomputes CSV load, preprocessing, and predictions per endpoint call.
- No Redis caching yet.
- `/api/crimes` returns all rows without pagination.
- Search loads and scans the full prepared frame.
- Frontend static generation attempts backend fetches and logs connection failures when backend is down.
- Leaflet markers are fine for demo data but will need clustering or vector tiling for large datasets.
- Database indexes exist, but no optimized query layer or materialized dashboard views are implemented.

## Security Issues

- Intelligence endpoints are public unless deployment adds external controls.
- Missing RBAC enforcement.
- Weak password hashing.
- No rate limiting.
- No audit logs.
- Demo credentials are documented and active.
- CORS allows configured origins but defaults are development-oriented.
- `.env.example` includes insecure defaults, which is acceptable for local demo but must be hardened before deployment.
- No input sanitization beyond basic Pydantic/query constraints in some routes.

## Missing Features

High-priority missing items from the new request:

- Premium operational dashboard with pending cases, station analytics, live filters, and real dashboard route.
- Modern GIS controls: cluster view, heatmap layer, drilldowns, radius search, route mapping, satellite/terrain layers, time slider, animated playback.
- DBSCAN, KMeans, and Kernel Density Estimation hotspot detection.
- Full criminal intelligence graph: suspect, victim, witness, location, gang/community detection, link prediction, modus operandi, connection strength, node explorer.
- Offender profile pages with history, movement, associates, timeline, and modus operandi.
- AI prediction engine with confidence, district risk, high-risk area prediction, and real explainability.
- Sociological overlays for education, employment, poverty, weather, festivals, and urbanization.
- Robust anomaly detection with auto alert workflow.
- Daily/weekly/monthly/yearly/seasonal/festival trend discovery and growth rate analysis.
- Real SHAP explanations.
- AI chat assistant.
- PDF/CSV/Excel report generation.
- Production-grade security: JWT, RBAC, rate limiting, password hashing, audit logs.

## Broken Or Risky Features

Evidence from verification:

- `python -m pytest -q`: passed, 15 tests.
- `python -m compileall backend ml database scripts etl tools`: passed.
- `npm audit --audit-level=moderate`: passed, 0 vulnerabilities.
- `npm run build`: passed and generated 17 routes.
- `docker compose config`: passed.

Observed risks despite passing verification:

- Next build logs repeated `fetch failed` / `ECONNREFUSED` messages when backend is not running. The build succeeds due fallback data, but the logs are noisy and can hide real API contract drift.
- Authentication tests pass with auth headers, but most protected-looking endpoints do not actually require auth.
- Root route is a public landing page; operational dashboard is no longer the first screen.
- Route data fallbacks can make frontend pages appear healthy when backend integration is broken.
- Some local utility/temp files exist at repo root: `tmp_extract_full_pdf.py`, `tmp_extract_pdf.py`, `tmp_inspect_csv.py`, `erd_full_text.txt`.

## Suggested Improvements

Immediate priorities:

1. Establish a clean baseline commit after reviewing untracked files.
2. Protect API routes with authentication and role-aware RBAC.
3. Replace SHA-256 password hashing with bcrypt or Argon2.
4. Add request logging, audit logs, and rate limiting.
5. Add dashboard cache layer and avoid recomputing predictions per endpoint.
6. Make `/dashboard` the operational dashboard route and keep `/landing` as the public showcase route.
7. Replace frontend silent fallbacks with visible API health/degraded-state indicators.
8. Implement real GIS filtering, cluster, heatmap, and radius-search APIs.
9. Add true ML modules for DBSCAN, KMeans, KDE, model comparison metrics, and SHAP.
10. Convert `dict` API responses to typed Pydantic response models.

## Development Roadmap

### Phase 1: Security And API Hardening

Goal: make the current platform safe enough to extend.

Deliverables:

- JWT-compatible access tokens or standard `python-jose` JWT flow.
- bcrypt/Argon2 password hashing.
- Route protection for dashboard, crimes, search, analytics, intelligence, reports.
- RBAC policy map for Admin, Police Officer, Investigator, Analyst.
- Rate limiting middleware.
- Audit log table and service.
- Tests for unauthorized, forbidden, and authorized access.

### Phase 2: Dashboard And Frontend Integration

Goal: restore dashboard-first operational UX and make filters real.

Deliverables:

- Operational dashboard as first authenticated screen.
- Public landing route separated.
- Shared smart filter component.
- Pending cases, station analytics, district comparison, live statistics.
- Theme toggle integrated into navbar.
- Loading skeletons and degraded API state.
- Frontend tests or smoke checks for major pages.

### Phase 3: GIS Intelligence Platform

Goal: replace basic map circles with real GIS workflows.

Deliverables:

- Marker clustering.
- Heatmap layer.
- District and police station drilldowns.
- Radius search API and UI.
- Satellite/terrain tile layer toggle.
- Time slider and animated playback.
- PostGIS-backed spatial query tests.

### Phase 4: Hotspot And Prediction Models

Goal: move from heuristics to model-backed intelligence.

Deliverables:

- DBSCAN spatial hotspot detection.
- KMeans area clustering.
- KDE hotspot surface generation.
- District risk score model.
- Trend forecasting with a real forecasting implementation.
- Confidence scoring and model metadata.
- Evaluation metrics: accuracy, precision, recall, F1, ROC-AUC, confusion matrix, cross-validation.

### Phase 5: Network And Offender Intelligence

Goal: build a criminal intelligence graph worthy of investigation workflows.

Deliverables:

- Victim, witness, suspect, location, and offender graph entities.
- Community/gang detection.
- Link prediction.
- Modus operandi detection.
- Connection strength scoring.
- Interactive graph explorer.
- Offender profile pages and movement timeline.

### Phase 6: Explainability, Anomalies, And Sociological Intelligence

Goal: make AI outputs trustworthy and contextual.

Deliverables:

- SHAP-backed model explanations.
- Anomaly alert workflow.
- Seasonal/festival trend analysis.
- Socio-economic overlays for education, employment, poverty, weather, urbanization, and density.
- District comparison dashboards.

### Phase 7: AI Assistant And Reports

Goal: add judge-friendly intelligence workflows.

Deliverables:

- Chat assistant API and UI.
- Natural-language crime statistics and reports.
- PDF, CSV, and Excel exports.
- District report, hotspot report, and AI intelligence report.
- Optional voice input.

### Phase 8: Productionization

Goal: harden deployment and operations.

Deliverables:

- Database migrations with Alembic.
- Background jobs for ETL/model training.
- Redis caching.
- Structured logs and observability.
- Deployment-ready environment configuration.
- User manual and developer guide.

## Recommended Next Phase

Start with Phase 1: Security And API Hardening.

Reason: the platform already has broad feature coverage, but most intelligence endpoints are not truly protected. Hardening auth/RBAC/rate limiting/audit logging first prevents later modules from being built on weak access controls.
