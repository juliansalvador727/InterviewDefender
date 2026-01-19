from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.db import get_db
from app.core.security import create_access_token
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

class DevLoginIn(BaseModel):
    github_id: str
    username: str
    avatar_url: str | None = None

async def issue_token_for_github_identity(
    db: AsyncSession,
    github_id: str,
    username: str,
    avatar_url: str | None,
) -> str:
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

    # IMPORTANT: keep token shape consistent with decode_token()
    return create_access_token({"sub": str(user.id)})

if settings.ENV == "dev":
    @router.post("/dev-login")
    async def dev_login(payload: DevLoginIn, db: AsyncSession = Depends(get_db)):
        jwt = await issue_token_for_github_identity(
            db=db,
            github_id=payload.github_id,
            username=payload.username,
            avatar_url=payload.avatar_url,
        )

        resp = JSONResponse({"ok": True})
        resp.set_cookie(
            key="session",
            value=jwt,
            httponly=True,
            samesite="lax",
            secure=False,  # True in prod (HTTPS)
            max_age=60 * 60 * 24 * 7,
            path="/",
        )
        return resp

@router.post("/logout")
def logout():
    resp = JSONResponse({"ok": True})
    resp.delete_cookie("session", path="/")
    return resp
