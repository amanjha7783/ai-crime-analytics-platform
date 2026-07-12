from fastapi.testclient import TestClient
from backend.app.main import create_app

app = create_app()
client = TestClient(app)

r = client.get('/api/health')
print('GET /api/health', r.status_code, r.json())

r2 = client.get('/api/analytics/socio-economic')
print('GET /api/analytics/socio-economic', r2.status_code)
print('keys:', list(r2.json().keys())[:5])
