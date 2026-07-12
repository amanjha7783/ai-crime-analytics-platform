# API

Base URL: `http://localhost:8000/api`

## Auth

### `POST /login`

Request:

```json
{
  "username": "admin@ksp.local",
  "password": "admin123"
}
```

Response includes `access_token`, `token_type`, and `user`.

## Health

### `GET /health`

Returns service status, name, and environment.

## Dashboard

### `GET /dashboard`

Returns:

- KPIs.
- District ranking.
- Trend data.
- Crime mix.
- Alert feed.

## Crimes

### `GET /crimes`

Supported query parameters:

- `district`
- `crime_type`
- `police_station`
- `status`
- `year`

## Intelligence

### `GET /hotspots`

Returns district-level hotspot confidence, coordinates, and risk level.

### `GET /predictions`

Returns crime classification, hotspots, risk scores, trend forecast, and explainability.

### `GET /network`

Returns nodes, edges, central criminals, and communities.

### `GET /repeat-offenders`

Returns offender IDs, crime count, recent activity, districts, crime types, and risk score.

### `GET /anomalies`

Returns suspicious district/date activity patterns.

### `GET /reports`

Returns an intelligence brief with sections for KPIs, district ranking, alerts, and EDA.

## Search

### `GET /search?q=...`

Searches FIR ID, criminal/offender ID, location, district, police station, status, and crime type.

## Analytics

### `GET /analytics/socio-economic`

Returns district-level crime count, population density, income category, high-risk cases, risk score, and correlation insight.
