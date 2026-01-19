from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import health, auth, me
from app.api.routes.github_app import router as github_app_router
from app.api.routes.oauth_github import router as oauth_github_router

app = FastAPI(title="Interview Simulator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(health.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(me.router, prefix="/api/v1")
app.include_router(github_app_router, prefix="/api/v1")

# OAuth routes (no /api/v1 prefix)
app.include_router(oauth_github_router)
