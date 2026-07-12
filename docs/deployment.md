# Deployment Guide

## Local Docker Deployment

```bash
docker compose up --build
```

This starts:

- PostgreSQL/PostGIS on `5432`.
- Redis on `6379`.
- FastAPI on `8000`.
- Next.js on `3000`.

## Backend On Render Or Railway

1. Create a Python web service.
2. Set build command:

```bash
pip install -r requirements.txt
```

3. Set start command:

```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
```

4. Add environment variables from `.env.example`.
5. Provision PostgreSQL with PostGIS support.
6. Run `database/schema.sql` against the database.
7. Run `python database/seed.py` after loading processed data.
8. Set `USE_DATABASE=true` when the backend should read from PostgreSQL/PostGIS instead of the local CSV demo file.

## Frontend On Vercel

1. Set project root to `frontend`.
2. Set environment variable:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-host
```

3. Use default build command:

```bash
npm run build
```

4. Use default output from Next.js.

## Production Notes

- Replace demo password hashes with an identity provider or secure user-management flow.
- Rotate `SECRET_KEY`.
- Restrict CORS origins.
- Move raw police data to private object storage.
- Use database-backed repositories for all API reads.
- Schedule ETL and model training through a controlled job runner.

## Batch Jobs

Run ETL:

```bash
python scripts/run_etl.py --input data/processed/crimes_sample.csv --output data/processed/crimes_features.csv
```

Run model comparison:

```bash
python scripts/train_models.py --data data/processed/crimes_sample.csv --output ml/training/model_metrics.json
```
