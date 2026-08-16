"""
models/prediction.py – Stored ML prediction results
"""

from datetime import datetime
from sqlalchemy import String, DateTime, Float, Integer, ForeignKey, func, JSON
from sqlalchemy.orm import Mapped, mapped_column
from backend.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Input features
    content_type: Mapped[str] = mapped_column(String(100), nullable=True)
    topic: Mapped[str] = mapped_column(String(100), nullable=True)
    day_of_week: Mapped[str] = mapped_column(String(20), nullable=True)
    posting_hour: Mapped[int] = mapped_column(Integer, nullable=True)
    caption_length: Mapped[int] = mapped_column(Integer, nullable=True)
    hashtag_count: Mapped[int] = mapped_column(Integer, nullable=True)
    followers: Mapped[int] = mapped_column(Integer, nullable=True)

    # Output
    prediction: Mapped[str] = mapped_column(String(20), nullable=False)   # LOW | MEDIUM | HIGH
    probability: Mapped[float] = mapped_column(Float, nullable=True)
    model_name: Mapped[str] = mapped_column(String(100), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
