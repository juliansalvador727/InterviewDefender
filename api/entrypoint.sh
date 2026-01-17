#!/usr/bin/env sh
set -e

echo "Waiting for Postgres..."
until python -c "import os; import psycopg2; psycopg2.connect(os.environ['ALEMBIC_DATABASE_URL']).close()" 2>/dev/null; do
  sleep 1
done
echo "Postgres is up."

echo "Running migrations..."
export PYTHONPATH=/app
alembic upgrade head

echo "Starting API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
