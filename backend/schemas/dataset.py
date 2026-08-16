"""
schemas/dataset.py – Request/Response schemas for dataset endpoints
"""

from datetime import datetime
from pydantic import BaseModel


class DatasetResponse(BaseModel):
    id: int
    name: str
    description: str | None
    row_count: int
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class DatasetListResponse(BaseModel):
    datasets: list[DatasetResponse]
