"""
models/recommendation.py – Stored recommendation results
"""

from datetime import datetime
from sqlalchemy import String, DateTime, Float, Integer, ForeignKey, func, Text
from sqlalchemy.orm import Mapped, mapped_column
from backend.database import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    dataset_id: Mapped[int] = mapped_column(ForeignKey("datasets.id", ondelete="CASCADE"), nullable=True, index=True)

    rank: Mapped[int] = mapped_column(Integer, nullable=False)
    content_type: Mapped[str] = mapped_column(String(100), nullable=True)
    topic: Mapped[str] = mapped_column(String(100), nullable=True)
    day: Mapped[str] = mapped_column(String(20), nullable=True)
    time_range: Mapped[str] = mapped_column(String(50), nullable=True)
    score: Mapped[float] = mapped_column(Float, nullable=True)
    reasons: Mapped[str] = mapped_column(Text, nullable=True)  # JSON-serialized list

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
