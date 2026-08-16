"""
services/dataset_service.py – CSV upload, parsing, and storage
"""

import os
import shutil
import uuid
from pathlib import Path

import pandas as pd
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from backend.models.dataset import Dataset
from backend.models.post import Post

# Where uploaded files are stored on disk
UPLOAD_DIR = Path("data/raw")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

REQUIRED_COLUMNS = {
    "post_id", "date", "content_type", "topic", "posting_time",
    "day_of_week", "caption_length", "hashtag_count", "followers",
    "impressions", "reach", "views", "likes", "comments", "shares", "saves",
}


def _compute_engagement_rate(df: pd.DataFrame) -> pd.Series:
    """engagement_rate = (likes + comments + shares + saves) / reach * 100"""
    total_interactions = df["likes"] + df["comments"] + df["shares"] + df["saves"]
    return (total_interactions / df["reach"].replace(0, pd.NA) * 100).round(4)


def _extract_posting_hour(posting_time: pd.Series) -> pd.Series:
    """Parse HH:MM string into integer hour, return NaN on failure."""
    return pd.to_datetime(posting_time, format="%H:%M", errors="coerce").dt.hour


def upload_dataset(db: Session, user_id: int, file: UploadFile, name: str, description: str = "") -> Dataset:
    """Save uploaded CSV, validate columns, parse rows, store in DB."""

    # 1. Save file to disk
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = UPLOAD_DIR / filename
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # 2. Load and validate
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read CSV: {e}")

    # Case-insensitive column check
    df.columns = [c.lower().strip() for c in df.columns]
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing columns: {missing}")

    # 3. Clean data
    df = _clean_dataframe(df)

    # 4. Create Dataset record
    dataset = Dataset(
        user_id=user_id,
        name=name,
        description=description,
        file_path=str(file_path),
        row_count=len(df),
        status="ready",
    )
    db.add(dataset)
    db.flush()  # get dataset.id before inserting posts

    # 5. Bulk-insert posts
    posts = []
    for _, row in df.iterrows():
        posts.append(Post(
            dataset_id=dataset.id,
            user_id=user_id,
            post_id=str(row.get("post_id", "")),
            date=pd.to_datetime(row.get("date"), errors="coerce").date() if pd.notna(row.get("date")) else None,
            content_type=row.get("content_type"),
            topic=row.get("topic"),
            posting_time=str(row.get("posting_time", "")),
            day_of_week=row.get("day_of_week"),
            caption_length=_safe_int(row.get("caption_length")),
            hashtag_count=_safe_int(row.get("hashtag_count")),
            followers=_safe_int(row.get("followers")),
            impressions=_safe_int(row.get("impressions")),
            reach=_safe_int(row.get("reach")),
            views=_safe_int(row.get("views")),
            likes=_safe_int(row.get("likes")),
            comments=_safe_int(row.get("comments")),
            shares=_safe_int(row.get("shares")),
            saves=_safe_int(row.get("saves")),
            engagement_rate=row.get("engagement_rate"),
            posting_hour=_safe_int(row.get("posting_hour")),
        ))
    db.bulk_save_objects(posts)
    db.commit()
    db.refresh(dataset)
    return dataset


def _clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Handle missing values, duplicates, invalid types, outliers."""
    # Drop full duplicates
    df = df.drop_duplicates()

    # Coerce numeric columns
    numeric_cols = ["caption_length", "hashtag_count", "followers",
                    "impressions", "reach", "views", "likes", "comments", "shares", "saves"]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Fill missing engagement metrics with 0
    for col in ["likes", "comments", "shares", "saves"]:
        df[col] = df[col].fillna(0)

    # Drop rows where reach is 0 or null (can't compute engagement rate)
    df = df[df["reach"].notna() & (df["reach"] > 0)]

    # Compute derived columns
    df["engagement_rate"] = _compute_engagement_rate(df)
    df["posting_hour"] = _extract_posting_hour(df["posting_time"])

    # Remove extreme outliers (engagement_rate > 100 is impossible)
    df = df[df["engagement_rate"] <= 100]

    # Fill missing categoricals with "Unknown"
    for col in ["content_type", "topic", "day_of_week"]:
        df[col] = df[col].fillna("Unknown")

    df = df.reset_index(drop=True)
    return df


def _safe_int(value) -> int | None:
    try:
        return int(value) if pd.notna(value) else None
    except (ValueError, TypeError):
        return None


def get_datasets_for_user(db: Session, user_id: int) -> list[Dataset]:
    return db.query(Dataset).filter(Dataset.user_id == user_id).order_by(Dataset.created_at.desc()).all()


def get_dataset_by_id(db: Session, dataset_id: int, user_id: int) -> Dataset:
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == user_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset


def get_posts_for_user(db: Session, user_id: int, dataset_id: int | None = None) -> list[Post]:
    """Return posts filtered by user (and optionally dataset)."""
    q = db.query(Post).filter(Post.user_id == user_id)
    if dataset_id:
        q = q.filter(Post.dataset_id == dataset_id)
    return q.all()
