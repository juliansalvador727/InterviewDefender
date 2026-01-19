import secrets
import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.core.db import get_db
from app.core.security import create_access_token
from app.models.user import User

router = APIRouter()

AUTHORIZE_URL = "https://github.com/login/oauth/authorize"
TOKEN_URL = "https://github.com/login/oauth/access_token"
USER_URL = "https://api.github.com/user"

SESSION_COOKIE = "session"

def _get_github_config():
    client_id = settings.GITHUB_CLIENT_ID
    client_secret = settings.GITHUB_CLIENT_SECRET
    redirect_uri = settings.GITHUB_REDIRECT_URI
    if not client_id or not client_secret or not redirect_uri:
        raise HTTPException(status_code=503, detail="GitHub OAuth is not configured")
    return client_id, client_secret, redirect_uri

@router.get("/auth/github/login")
def github_login():
    state = secrets.token_urlsafe(32)
    client_id, _secret, redirect_uri = _get_github_config()

    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "state": state,
        "scope": "read:user user:email",
    }

    authorize_url = httpx.URL(AUTHORIZE_URL).copy_merge_params(params)
    resp = RedirectResponse(str(authorize_url))

    resp.set_cookie(
        "oauth_state",
        state,
        httponly=True,
        samesite="lax",
        max_age=600,
        path="/auth/github",
        secure=settings.COOKIE_SECURE,   # add this setting
    )
    return resp

@router.get("/auth/github/callback")
async def github_callback(
    request: Request,
    code: str | None = None,
    state: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    if not code or not state:
        raise HTTPException(status_code=400, detail="Missing code/state")

    cookie_state = request.cookies.get("oauth_state")
    if not cookie_state or cookie_state != state:
        raise HTTPException(status_code=400, detail="Invalid OAuth state")

    client_id, client_secret, redirect_uri = _get_github_config()

    async with httpx.AsyncClient(timeout=15) as client:
        token_resp = await client.post(
            TOKEN_URL,
            headers={"Accept": "application/json"},
            json={
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code,
                "redirect_uri": redirect_uri,
            },
        )
        token_resp.raise_for_status()
        access_token = token_resp.json().get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token returned by GitHub")

        user_resp = await client.get(
            USER_URL,
            headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"},
        )
        user_resp.raise_for_status()
        gh = user_resp.json()

    github_id = str(gh["id"])
    username = gh["login"]
    avatar_url = gh.get("avatar_url")

    stmt = select(User).where(User.github_id == github_id)
    user = (await db.execute(stmt)).scalar_one_or_none()

    if not user:
        user = User(github_id=github_id, username=username, avatar_url=avatar_url)
        db.add(user)
        await db.commit()
        await db.refresh(user)
    else:
        changed = False
        if user.username != username:
            user.username = username
            changed = True
        if user.avatar_url != avatar_url:
            user.avatar_url = avatar_url
            changed = True
        if changed:
            await db.commit()

    jwt = create_access_token(subject=str(user.id))

    resp = RedirectResponse(url=f"{settings.FRONTEND_URL}/", status_code=302)
    resp.delete_cookie("oauth_state", path="/auth/github")

    resp.set_cookie(
        key=SESSION_COOKIE,
        value=jwt,
        httponly=True,
        samesite="lax",
        secure=settings.COOKIE_SECURE,
        max_age=60 * 60 * 24 * 7,
        path="/",
    )
    return resp
