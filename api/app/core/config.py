from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",  # ignore env vars you don't model
    )

    # Database
    DATABASE_URL: str
    ALEMBIC_DATABASE_URL: str | None = None

    # JWT
    JWT_SECRET: str
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_MINUTES: int = 15

    # Frontend
    FRONTEND_URL: str = "http://localhost:5173"

    # GitHub App (Path B)
    GITHUB_APP_ID: int
    GITHUB_APP_SLUG: str
    GITHUB_APP_PRIVATE_KEY_PATH: str

    # Optional (not used by your current github_app.py)
    GITHUB_APP_CLIENT_ID: str | None = None
    GITHUB_APP_CLIENT_SECRET: str | None = None
    GITHUB_APP_CALLBACK_URL: str | None = None


settings = Settings()
