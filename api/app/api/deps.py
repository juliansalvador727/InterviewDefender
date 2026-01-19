from fastapi import Depends, HTTPException, status, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.db import get_db
from app.core.security import decode_token
from app.models.user import User

SESSION_COOKIE = "session"

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    session: str | None = Cookie(default=None, alias=SESSION_COOKIE),
) -> User:
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    try:
        user_id = decode_token(session)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session",
        )

    stmt = select(User).where(User.id == int(user_id))
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user
