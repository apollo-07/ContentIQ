"""
services/strategy_service.py – Weekly content calendar strategy
"""

import pandas as pd
from sqlalchemy.orm import Session

from backend.models.post import Post
from backend.schemas.strategy import StrategyItem, StrategyResponse

DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def _posts_to_df(posts: list[Post]) -> pd.DataFrame:
    return pd.DataFrame([{
        "content_type": p.content_type,
        "topic": p.topic,
        "day_of_week": p.day_of_week,
        "posting_hour": p.posting_hour,
        "engagement_rate": p.engagement_rate,
    } for p in posts])


def get_strategy(db: Session, user_id: int) -> StrategyResponse:
    """
    Build a 7-day content strategy by assigning the best-performing
    (content_type, topic, time) combination to each day of the week.
    """
    posts = db.query(Post).filter(Post.user_id == user_id).all()
    df = _posts_to_df(posts).dropna(subset=["engagement_rate"])

    if df.empty:
        # Return a sensible default strategy
        return _default_strategy()

    # Best content type overall
    ct_avg = df.groupby("content_type")["engagement_rate"].mean()
    top_content_types = ct_avg.nlargest(3).index.tolist()

    # Best topic overall
    topic_avg = df.groupby("topic")["engagement_rate"].mean()
    top_topics = topic_avg.nlargest(3).index.tolist()

    # Best hour overall
    hour_avg = df.dropna(subset=["posting_hour"]).groupby("posting_hour")["engagement_rate"].mean()
    best_hour = int(hour_avg.idxmax()) if not hour_avg.empty else 19

    # Per-day best content type
    day_ct = df.groupby(["day_of_week", "content_type"])["engagement_rate"].mean()

    strategy = []
    overall_avg = df["engagement_rate"].mean()
    max_score = ct_avg.max() + topic_avg.max()
    min_score = ct_avg.min() + topic_avg.min()
    score_range = max_score - min_score or 1

    for i, day in enumerate(DAY_ORDER):
        # Pick best content type for this day (fall back to top-3 rotation)
        day_ct_slice = day_ct.get(day, None)
        if day_ct_slice is not None and not isinstance(day_ct_slice, float):
            ct = day_ct_slice.idxmax()
        else:
            ct = top_content_types[i % len(top_content_types)]

        # Pick topic in rotation
        topic = top_topics[i % len(top_topics)]

        # Score
        raw = ct_avg.get(ct, overall_avg) + topic_avg.get(topic, overall_avg)
        norm_score = round(60 + 40 * (raw - min_score) / score_range, 1)

        strategy.append(StrategyItem(
            day=day,
            content_type=ct,
            topic=topic,
            time_range=f"{best_hour:02d}:00-{best_hour + 2:02d}:00",
            score=norm_score,
        ))

    return StrategyResponse(strategy=strategy)


def _default_strategy() -> StrategyResponse:
    """Fallback strategy when no data is available."""
    defaults = [
        ("Reel", "Behind the Scenes"),
        ("Image", "Educational"),
        ("Reel", "Product"),
        ("Story", "Tutorial"),
        ("Reel", "Entertainment"),
        ("Image", "User Generated"),
        ("Reel", "Promotional"),
    ]
    strategy = [
        StrategyItem(day=day, content_type=ct, topic=topic, time_range="19:00-21:00", score=75.0)
        for (ct, topic), day in zip(defaults, DAY_ORDER)
    ]
    return StrategyResponse(strategy=strategy)
