FROM python:3.12-slim

WORKDIR /app

# Basic shell (useful for entrypoint)
RUN apt-get update && apt-get install -y --no-install-recommends bash \
  && rm -rf /var/lib/apt/lists/*

COPY . /app

# Install runtime + migration deps
RUN pip install --no-cache-dir \
  fastapi uvicorn[standard] \
  sqlalchemy[asyncio] asyncpg \
  alembic psycopg2-binary \
  pydantic-settings python-jose[cryptography] httpx \
  PyJWT[crypto]


EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]
