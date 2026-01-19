from datetime import datetime 
from sqlalchemy import String, DateTime 
from sqlalchemy.orm import Mapped, mapped_column 
from app.core.db import Base 
from sqlalchemy import Column, Integer

from sqlalchemy import BigInteger  # add this import

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    github_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    username: Mapped[str] = mapped_column(String(128), index=True)
    avatar_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # NEW: GitHub App installation id (from the install flow)
    github_installation_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
