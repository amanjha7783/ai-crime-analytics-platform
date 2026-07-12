# Deliverables Checklist

| Deliverable | Location |
| --- | --- |
| Complete source code | `backend/`, `frontend/`, `ml/`, `etl/`, `database/`, `scripts/` |
| Professional UI | `frontend/app`, `frontend/components` |
| Backend | `backend/app` |
| Database schema | `database/schema.sql` |
| ML pipeline | `ml/prediction`, `ml/models`, `ml/training` |
| Data preprocessing | `ml/preprocessing`, `etl/pipeline.py` |
| Feature engineering | `ml/preprocessing/features.py` |
| API documentation | `docs/api.md` and FastAPI `/docs` |
| Docker setup | `docker-compose.yml`, `docker/` |
| README | `README.md` |
| Deployment guide | `docs/deployment.md` |
| PowerPoint source and generator | `docs/presentation.md`, `scripts/generate_presentation.py` |
| Architecture diagram | `docs/diagrams.md` |
| Workflow diagram | `docs/diagrams.md` |
| Flowchart | `docs/diagrams.md` |
| Database ER diagram | `docs/diagrams.md` |
| Sequence diagram | `docs/diagrams.md` |
| Use case diagram | `docs/diagrams.md` |
| Class diagram | `docs/diagrams.md` |
| Future scope | `docs/future-scope.md` |

## Named Platform Capabilities

| Capability | Implementation |
| --- | --- |
| Crime hotspot prediction | `ml/models/hotspot.py`, `/api/hotspots`, `/hotspots` |
| Criminal network analysis | `ml/models/network.py`, `/api/network`, `/network-analysis` |
| Repeat offender identification | `ml/models/repeat_offender.py`, `/api/repeat-offenders`, `/repeat-offenders` |
| District-level analytics | `/api/dashboard`, `/analytics` |
| Geospatial crime visualization | PostGIS schema, `/crime-map`, `/heatmaps` |
| Crime trend forecasting | `ml/models/trend.py`, `/api/predictions` |
| AI anomaly detection | `ml/models/anomaly.py`, `/api/anomalies` |
| Explainable AI predictions | `ml/explainability/shap_explainer.py`, `/predictions` |
| Socio-economic correlation analysis | `/api/analytics/socio-economic`, `/analytics` |
| Real-time dashboard | Dashboard shell with refreshable API contracts |
| Search module | `/api/search`, `/search` |
| User authentication | `/api/login`, `/login`, role metadata in backend auth service |
