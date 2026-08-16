"""
models/post.py – Individual social-media posts table
"""

from datetime import datetime, date
from sqlalchemy import String, DateTime, Integer, Float, ForeignKey, Date, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.database import Base


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    dataset_id: Mapped[int] = mapped_column(ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Original columns from the CSV
    post_id: Mapped[str] = mapped_column(String(100), nullable=True)
    date: Mapped[date] = mapped_column(Date, nullable=True)
    content_type: Mapped[str] = mapped_column(String(100), nullable=True)
    topic: Mapped[str] = mapped_column(String(100), nullable=True)
    posting_time: Mapped[str] = mapped_column(String(50), nullable=True)
    day_of_week: Mapped[str] = mapped_column(String(20), nullable=True)
    caption_length: Mapped[int] = mapped_column(Integer, nullable=True)
    hashtag_count: Mapped[int] = mapped_column(Integer, nullable=True)
    followers: Mapped[int] = mapped_column(Integer, nullable=True)

    # Engagement metrics
    impressions: Mapped[int] = mapped_column(Integer, nullable=True)
    reach: Mapped[int] = mapped_column(Integer, nullable=True)
    views: Mapped[int] = mapped_column(Integer, nullable=True)
    likes: Mapped[int] = mapped_column(Integer, nullable=True)
    comments: Mapped[int] = mapped_column(Integer, nullable=True)
    shares: Mapped[int] = mapped_column(Integer, nullable=True)
    saves: Mapped[int] = mapped_column(Integer, nullable=True)

    # Derived / calculated
    engagement_rate: Mapped[float] = mapped_column(Float, nullable=True)
    posting_hour: Mapped[int] = mapped_column(Integer, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    dataset = relationship("Dataset", back_populates="posts")
