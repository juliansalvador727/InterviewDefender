#!/usr/bin/env bash
set -euo pipefail

echo "Starting API..."

# Run migrations if ALEMBIC_DATABASE_URL is set, else use DATABASE_URL (converted to sync URL)
if [[ -n "${ALEMBIC_DATABASE_URL:-}" ]]; then
  echo "Running migrations (ALEMBIC_DATABASE_URL)..."
  alembic upgrade head
else
  # If you only have DATABASE_URL (async), alembic still needs a sync URL.
  # Easiest: require ALEMBIC_DATABASE_URL in env. Recommended.
  echo "No ALEMBIC_DATABASE_URL set; running migrations may fail if DATABASE_URL is async."
  echo "Tip: set ALEMBIC_DATABASE_URL to the same Neon URL but sync (postgresql://...)"
  alembic upgrade head || true
fi

exec uvicorn app.main:app --host 0.0.0.0 --port 8000
