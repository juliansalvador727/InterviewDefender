from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/me")
async def me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "github_id": user.github_id,
        "username": user.username,
        "avatar_url": user.avatar_url,
    }
