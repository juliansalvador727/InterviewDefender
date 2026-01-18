from pydantic import ConfigDict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", env_file_encoding="utf-8")

    DATABASE_URL: str = "postgresql+asyncpg://app:app@localhost:5432/app"
    JWT_SECRET: str = "dev-secret-change-me"
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_MINUTES: int = 15
    FRONTEND_URL: str = "http://localhost:5173"

    GITHUB_CLIENT_ID: str | None = None
    GITHUB_CLIENT_SECRET: str | None = None
    GITHUB_REDIRECT_URI: str = "http://localhost:8000/auth/github/callback"

settings = Settings()
