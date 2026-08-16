"""
routes/datasets.py – POST /datasets/upload, GET /datasets, GET /datasets/{dataset_id}
"""

from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User
from backend.routes.deps import get_current_user
from backend.schemas.dataset import DatasetResponse, DatasetListResponse
from backend.services import dataset_service

router = APIRouter(prefix="/datasets", tags=["Datasets"])


@router.post("/upload", response_model=DatasetResponse, status_code=201)
def upload_dataset(
    file: UploadFile = File(..., description="CSV file with social media post data"),
    name: str = Form(..., description="Dataset name"),
    description: str = Form("", description="Optional description"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload a CSV dataset.

    Required CSV columns: post_id, date, content_type, topic, posting_time,
    day_of_week, caption_length, hashtag_count, followers, impressions, reach,
    views, likes, comments, shares, saves.

    The server will validate columns, clean data, compute engagement_rate,
    and store all rows in the database.
    """
    return dataset_service.upload_dataset(db, current_user.id, file, name, description)


@router.get("", response_model=DatasetListResponse)
def list_datasets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all datasets owned by the current user."""
    datasets = dataset_service.get_datasets_for_user(db, current_user.id)
    return DatasetListResponse(datasets=datasets)


@router.get("/{dataset_id}", response_model=DatasetResponse)
def get_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return a single dataset by ID. Returns 404 if not found or not owned by current user."""
    return dataset_service.get_dataset_by_id(db, dataset_id, current_user.id)
