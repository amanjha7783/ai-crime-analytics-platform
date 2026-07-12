$ErrorActionPreference = "Stop"

python -m pytest -q
python -m compileall backend ml database scripts etl
Push-Location frontend
npm audit --audit-level=moderate
npm run build
Pop-Location
