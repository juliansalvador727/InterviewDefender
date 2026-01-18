from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.db import get_db
from app.core.security import create_access_token
from app.models.user import User

router = APIRouter()

class DevLoginIn(BaseModel):
    github_id: str
    username: str
    avatar_url: str | None = None

async def issue_token_for_github_identity(
    db: AsyncSession,
    github_id: str,
    username: str,
    avatar_url: str | None,
) -> dict:
    stmt = select(User).where(User.github_id == github_id)
    user = (await db.execute(stmt)).scalar_one_or_none()

    if not user:
        user = User(github_id=github_id, username=username, avatar_url=avatar_url)
        db.add(user)
        await db.commit()
        await db.refresh(user)
    else:
        # optional: keep profile fresh
        changed = False
        if user.username != username:
            user.username = username
            changed = True
        if user.avatar_url != avatar_url:
            user.avatar_url = avatar_url
            changed = True
        if changed:
            await db.commit()

    token = create_access_token(subject=str(user.id))
    return {"access_token": token, "token_type": "bearer"}

@router.post("/auth/dev-login")
async def dev_login(payload: DevLoginIn, db: AsyncSession = Depends(get_db)):
    return await issue_token_for_github_identity(
        db=db,
        github_id=payload.github_id,
        username=payload.username,
        avatar_url=payload.avatar_url,
    )
