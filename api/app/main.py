import secrets 
import httpx

from fastapi.responses import RedirectResponse
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health, auth, me

from app.api.routes.github_app import router as github_app_router


from app.core.db import get_db

FRONTEND_URL = settings.FRONTEND_URL

AUTHORIZE_URL = "https://github.com/login/oauth/authorize"
TOKEN_URL = "https://github.com/login/oauth/access_token"
USER_URL = "https://api.github.com/user"


app = FastAPI(title="Interview Simulator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True, #true if using cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(me.router, prefix="/api/v1")
app.include_router(github_app_router, prefix="/api/v1")

def _get_github_config():
    client_id = settings.GITHUB_CLIENT_ID
    client_secret = settings.GITHUB_CLIENT_SECRET
    redirect_uri = settings.GITHUB_REDIRECT_URI
    if not client_id or not client_secret:
        raise HTTPException(status_code=503, detail="GitHub OAuth is not configured")
    return client_id, client_secret, redirect_uri

@app.get("/auth/github/login")
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
    )
    return resp

@app.get("/auth/github/callback")
async def github_callback(request: Request, code: str | None = None, state: str | None = None):
    if not code or not state:
        raise HTTPException(400, "Missing code/state")

    cookie_state = request.cookies.get("oauth_state")
    print("state param:", state, "cookie:", cookie_state)
    if not cookie_state or cookie_state != state:
        raise HTTPException(400, "Invalid state")

    client_id, client_secret, redirect_uri = _get_github_config()
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            TOKEN_URL,
            data={
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code,
                "redirect_uri": redirect_uri,
            },
            headers={"Accept": "application/json"},
        )
        token_data = token_resp.json()
        gh_access_token = token_data.get("access_token")
        if not gh_access_token:
            raise HTTPException(400, f"Token exchange failed: {token_data}")

        user_resp = await client.get(
            USER_URL,
            headers={"Authorization": f"Bearer {gh_access_token}", "Accept": "application/vnd.github+json"},
        )
        user = user_resp.json()

    github_id = str(user.get("id"))
    username = user.get("login")
    avatar_url = user.get("avatar_url")

    if not github_id or not username:
        raise HTTPException(400, "GitHub user payload missing id/login")

    async for db in get_db():
        token_payload = await auth.issue_token_for_github_identity(
            db=db,
            github_id=github_id,
            username=username,
            avatar_url=avatar_url,
        )
        break

    app_access_token = token_payload["access_token"]
    resp = RedirectResponse(url=f"{FRONTEND_URL}/?token={app_access_token}")
    resp.delete_cookie("oauth_state", path="/auth/github")
    return resp
