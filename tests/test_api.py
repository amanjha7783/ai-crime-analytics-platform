from fastapi.testclient import TestClient

from backend.app.main import create_app


client = TestClient(create_app())


def get_auth_headers() -> dict[str, str]:
    response = client.post(
        "/api/login",
        json={"username": "admin@ksp.local", "password": "admin123"},
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token
    return {"Authorization": f"Bearer {token}"}


def test_health_endpoint_returns_service_status() -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_login_returns_role_and_token() -> None:
    response = client.post(
        "/api/login",
        json={"username": "admin@ksp.local", "password": "admin123"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["user"]["role"] == "Admin"
    assert body["access_token"]


def test_me_endpoint_returns_authenticated_user() -> None:
    response = client.get("/api/me", headers=get_auth_headers())

    assert response.status_code == 200
    body = response.json()
    assert body["username"] == "admin@ksp.local"
    assert body["role"] == "Admin"


def test_dashboard_endpoint_returns_kpis_and_district_ranking() -> None:
    response = client.get("/api/dashboard", headers=get_auth_headers())

    assert response.status_code == 200
    body = response.json()
    assert body["kpis"]["total_crimes"] > 0
    assert body["district_ranking"]
    assert body["trend"]


def test_core_intelligence_endpoints_return_data() -> None:
    headers = get_auth_headers()
    for path in [
        "/api/crimes",
        "/api/hotspots",
        "/api/predictions",
        "/api/network",
        "/api/repeat-offenders",
        "/api/anomalies",
        "/api/reports",
    ]:
        response = client.get(path, headers=headers)
        assert response.status_code == 200, path
        assert response.json(), path
