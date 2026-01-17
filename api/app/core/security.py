from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from fastapi import HTTPException, status
from app.core.config import settings

def create_access_token(*, subject: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_MINUTES)
    payload = {"sub": subject, "exp": exp}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALG)

def decode_token(token: str) -> str:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])
        sub = payload.get("sub")
        if not sub:
            raise ValueError("missing sub")
        return sub
    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
