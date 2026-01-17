from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://app:app@localhost:5432/app"
    JWT_SECRET: str = "dev-secret-change-me"
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_MINUTES: int = 15
    FRONTEND_URL: str = "http://localhost:5173"

settings = Settings()
