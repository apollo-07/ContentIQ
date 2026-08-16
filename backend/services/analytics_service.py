"""
services/analytics_service.py – Compute all analytics from stored posts
"""

from collections import defaultdict
import pandas as pd
from sqlalchemy.orm import Session

from backend.models.post import Post
from backend.schemas.analytics import (
    OverviewResponse, ContentTypesResponse, ContentTypeItem,
    TopicsResponse, TopicItem, TimingResponse, DayItem, HourItem,
    TrendsResponse, TrendPoint,
)

DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def _posts_to_df(posts: list[Post]) -> pd.DataFrame:
    """Convert list of Post ORM objects to a pandas DataFrame."""
    records = [
        {
            "content_type": p.content_type,
            "topic": p.topic,
            "day_of_week": p.day_of_week,
            "posting_hour": p.posting_hour,
            "engagement_rate": p.engagement_rate,
            "likes": p.likes or 0,
            "comments": p.comments or 0,
            "shares": p.shares or 0,
            "saves": p.saves or 0,
            "date": p.date,
        }
        for p in posts
    ]
    return pd.DataFrame(records)


def get_overview(db: Session, user_id: int) -> OverviewResponse:
    posts = db.query(Post).filter(Post.user_id == user_id).all()
    if not posts:
        return OverviewResponse(
            total_posts=0, average_engagement_rate=0.0,
            total_engagement=0, best_content_type="N/A",
            best_topic="N/A", best_posting_time="N/A",
        )

    df = _posts_to_df(posts)
    df = df.dropna(subset=["engagement_rate"])

    total_engagement = int((df["likes"] + df["comments"] + df["shares"] + df["saves"]).sum())

    best_ct = (
        df.groupby("content_type")["engagement_rate"].mean().idxmax()
        if not df.empty else "N/A"
    )
    best_topic = (
        df.groupby("topic")["engagement_rate"].mean().idxmax()
        if not df.empty else "N/A"
    )

    # Best posting time = hour bucket with highest avg engagement
    hour_avg = df.groupby("posting_hour")["engagement_rate"].mean()
    if not hour_avg.empty:
        best_hour = int(hour_avg.idxmax())
        best_time = f"{best_hour:02d}:00-{best_hour + 2:02d}:00"
    else:
        best_time = "N/A"

    return OverviewResponse(
        total_posts=len(posts),
        average_engagement_rate=round(df["engagement_rate"].mean(), 2),
        total_engagement=total_engagement,
        best_content_type=str(best_ct),
        best_topic=str(best_topic),
        best_posting_time=best_time,
    )


def get_content_types(db: Session, user_id: int) -> ContentTypesResponse:
    posts = db.query(Post).filter(Post.user_id == user_id).all()
    if not posts:
        return ContentTypesResponse(data=[])
    df = _posts_to_df(posts).dropna(subset=["engagement_rate"])

    items = []
    for ct, group in df.groupby("content_type"):
        items.append(ContentTypeItem(
            content_type=str(ct),
            post_count=len(group),
            average_engagement_rate=round(group["engagement_rate"].mean(), 4),
            median_engagement_rate=round(group["engagement_rate"].median(), 4),
        ))
    items.sort(key=lambda x: x.average_engagement_rate, reverse=True)
    return ContentTypesResponse(data=items)


def get_topics(db: Session, user_id: int) -> TopicsResponse:
    posts = db.query(Post).filter(Post.user_id == user_id).all()
    if not posts:
        return TopicsResponse(data=[])
    df = _posts_to_df(posts).dropna(subset=["engagement_rate"])

    items = []
    for topic, group in df.groupby("topic"):
        items.append(TopicItem(
            topic=str(topic),
            post_count=len(group),
            average_engagement_rate=round(group["engagement_rate"].mean(), 4),
            median_engagement_rate=round(group["median_engagement_rate"], 4) if "median_engagement_rate" in group else round(group["engagement_rate"].median(), 4),
        ))
    items.sort(key=lambda x: x.average_engagement_rate, reverse=True)
    return TopicsResponse(data=items)


def get_timing(db: Session, user_id: int) -> TimingResponse:
    posts = db.query(Post).filter(Post.user_id == user_id).all()
    if not posts:
        return TimingResponse(day_data=[], hour_data=[])
    df = _posts_to_df(posts).dropna(subset=["engagement_rate"])

    # Day data (ordered Mon–Sun)
    day_avg = df.groupby("day_of_week")["engagement_rate"].mean().reset_index()
    day_items = []
    for day in DAY_ORDER:
        row = day_avg[day_avg["day_of_week"] == day]
        if not row.empty:
            day_items.append(DayItem(day=day, average_engagement_rate=round(float(row["engagement_rate"].values[0]), 4)))

    # Hour data (sorted)
    hour_avg = df.groupby("posting_hour")["engagement_rate"].mean().reset_index().sort_values("posting_hour")
    hour_items = [
        HourItem(hour=int(r["posting_hour"]), average_engagement_rate=round(float(r["engagement_rate"]), 4))
        for _, r in hour_avg.iterrows()
        if pd.notna(r["posting_hour"])
    ]

    return TimingResponse(day_data=day_items, hour_data=hour_items)


def get_trends(db: Session, user_id: int) -> TrendsResponse:
    posts = db.query(Post).filter(Post.user_id == user_id).all()
    if not posts:
        return TrendsResponse(data=[])
    df = _posts_to_df(posts).dropna(subset=["engagement_rate", "date"])
    df["date"] = pd.to_datetime(df["date"])
    df["week"] = df["date"].dt.to_period("W").dt.start_time.dt.strftime("%Y-%m-%d")

    weekly = df.groupby("week").agg(
        average_engagement_rate=("engagement_rate", "mean"),
        post_count=("engagement_rate", "count"),
    ).reset_index().sort_values("week")

    points = [
        TrendPoint(
            date=r["week"],
            average_engagement_rate=round(float(r["average_engagement_rate"]), 4),
            post_count=int(r["post_count"]),
        )
        for _, r in weekly.iterrows()
    ]
    return TrendsResponse(data=points)
