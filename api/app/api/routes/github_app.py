import os
import time
import secrets
import httpx
import jwt  # pyjwt
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.db import get_db
from app.models.user import User

# IMPORTANT: reuse your existing auth dependency.
# This should return the current User from your JWT.
# If yours is named differently, swap it here.
from app.api.routes.me import get_current_user  # adjust if needed

router = APIRouter(prefix="/github/app", tags=["github-app"])

CONNECT_COOKIE = "gh_connect"
CONNECT_MAX_AGE = 10 * 60  # 10 minutes


def _read_private_key() -> str:
    path = settings.GITHUB_APP_PRIVATE_KEY_PATH
    if not path:
        raise HTTPException(503, "Missing GITHUB_APP_PRIVATE_KEY_PATH")
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        raise HTTPException(503, f"Private key not found at {path}")


def _make_app_jwt() -> str:
    app_id = settings.GITHUB_APP_ID
    if not app_id:
        raise HTTPException(503, "Missing GITHUB_APP_ID")

    private_key = _read_private_key()
    now = int(time.time())
    payload = {
        "iat": now - 30,
        "exp": now + 9 * 60,  # must be <= 10 minutes
        "iss": app_id,
    }
    return jwt.encode(payload, private_key, algorithm="RS256")


async def _mint_installation_token(installation_id: int) -> str:
    app_jwt = _make_app_jwt()
    url = f"https://api.github.com/app/installations/{installation_id}/access_tokens"

    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(
            url,
            headers={
                "Authorization": f"Bearer {app_jwt}",
                "Accept": "application/vnd.github+json",
            },
        )

    if r.status_code >= 400:
        raise HTTPException(r.status_code, f"Failed to mint installation token: {r.text}")

    return r.json()["token"]


@router.post("/start")
async def start_connect_github(current_user: User = Depends(get_current_user)):
    """
    Called by frontend with Authorization header.
    Sets a short-lived httpOnly cookie so callback can link installation_id to this user.
    Returns the GitHub install URL to navigate to.
    """
    slug = settings.GITHUB_APP_SLUG
    if not slug:
        raise HTTPException(503, "Missing GITHUB_APP_SLUG")

    # Random nonce so cookie can't be guessed; store user id + nonce in cookie.
    nonce = secrets.token_urlsafe(24)
    value = f"{current_user.id}:{nonce}"

    resp = JSONResponse(
        {
            "install_url": f"https://github.com/apps/{slug}/installations/new"
        }
    )
    resp.set_cookie(
        key=CONNECT_COOKIE,
        value=value,
        httponly=True,
        samesite="lax",
        max_age=CONNECT_MAX_AGE,
        path="/api/v1/github/app",
    )
    return resp


@router.get("/callback")
async def github_app_callback(
    request: Request,
    installation_id: int | None = None,
    db: AsyncSession = Depends(get_db),
):
    """
    GitHub redirects here after install. We read the connect cookie to find the user.
    """
    if not installation_id:
        raise HTTPException(400, "Missing installation_id")

    cookie = request.cookies.get(CONNECT_COOKIE)
    if not cookie or ":" not in cookie:
        raise HTTPException(400, "Missing or invalid connect cookie")

    user_id_str, _nonce = cookie.split(":", 1)
    try:
        user_id = int(user_id_str)
    except ValueError:
        raise HTTPException(400, "Invalid connect cookie user id")

    # Save installation_id
    stmt = select(User).where(User.id == user_id)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(400, "User not found for connect cookie")

    user.github_installation_id = installation_id
    await db.commit()

    resp = RedirectResponse(settings.FRONTEND_URL + "/")
    resp.delete_cookie(CONNECT_COOKIE, path="/api/v1/github/app")
    return resp


@router.get("/repos")
async def list_repos(
    current_user: User = Depends(get_current_user),
):
    if not current_user.github_installation_id:
        raise HTTPException(400, "GitHub App not connected yet.")

    token = await _mint_installation_token(current_user.github_installation_id)

    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.get(
            "https://api.github.com/installation/repositories?per_page=100",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github+json",
            },
        )

    if r.status_code >= 400:
        raise HTTPException(r.status_code, r.text)

    data = r.json()
    return {
        "total_count": data.get("total_count", 0),
        "repositories": data.get("repositories", []),
    }
