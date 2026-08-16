"""
models/model_run.py – ML model training run metadata
"""

from datetime import datetime
from sqlalchemy import String, DateTime, Float, Integer, func, Text
from sqlalchemy.orm import Mapped, mapped_column
from backend.database import Base


class ModelRun(Base):
    __tablename__ = "model_runs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)   # e.g. RandomForest
    accuracy: Mapped[float] = mapped_column(Float, nullable=True)
    precision: Mapped[float] = mapped_column(Float, nullable=True)
    recall: Mapped[float] = mapped_column(Float, nullable=True)
    f1_score: Mapped[float] = mapped_column(Float, nullable=True)
    is_best: Mapped[bool] = mapped_column(default=False)
    artifact_path: Mapped[str] = mapped_column(String(512), nullable=True)  # path to .pkl
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    trained_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
