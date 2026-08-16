"""
services/recommendation_service.py – Rule/stats-based recommendation engine
"""

import pandas as pd
from sqlalchemy.orm import Session
from itertools import product

from backend.models.post import Post
from backend.schemas.insights import RecommendationItem, RecommendationsResponse

DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def _posts_to_df(posts: list[Post]) -> pd.DataFrame:
    return pd.DataFrame([{
        "content_type": p.content_type,
        "topic": p.topic,
        "day_of_week": p.day_of_week,
        "posting_hour": p.posting_hour,
        "engagement_rate": p.engagement_rate,
    } for p in posts])


def _hour_to_range(hour: float) -> str:
    h = int(hour)
    return f"{h:02d}:00-{h + 2:02d}:00"


def get_recommendations(db: Session, user_id: int, top_n: int = 5) -> RecommendationsResponse:
    posts = db.query(Post).filter(Post.user_id == user_id).all()
    if not posts:
        return RecommendationsResponse(recommendations=[])

    df = _posts_to_df(posts).dropna(subset=["engagement_rate"])

    if df.empty:
        return RecommendationsResponse(recommendations=[])

    # Pre-compute group averages for fast lookup
    ct_avg   = df.groupby("content_type")["engagement_rate"].mean().to_dict()
    top_avg  = df.groupby("topic")["engagement_rate"].mean().to_dict()
    day_avg  = df.groupby("day_of_week")["engagement_rate"].mean().to_dict()
    hour_avg = df.dropna(subset=["posting_hour"]).groupby("posting_hour")["engagement_rate"].mean()

    best_hour = int(hour_avg.idxmax()) if not hour_avg.empty else 19
    overall_avg = df["engagement_rate"].mean()

    content_types = df["content_type"].dropna().unique().tolist()
    topics        = df["topic"].dropna().unique().tolist()
    days          = [d for d in DAY_ORDER if d in day_avg]

    combos = []
    for ct, topic, day in product(content_types, topics, days):
        # Weighted score: 40% content type, 35% topic, 25% day
        ct_score    = ct_avg.get(ct, overall_avg)
        topic_score = top_avg.get(topic, overall_avg)
        day_score   = day_avg.get(day, overall_avg)
        raw_score   = 0.40 * ct_score + 0.35 * topic_score + 0.25 * day_score
        combos.append((ct, topic, day, raw_score))

    combos.sort(key=lambda x: x[3], reverse=True)

    # Normalise to 0–100
    max_score = combos[0][3] if combos else 1
    min_score = combos[-1][3] if combos else 0
    score_range = max_score - min_score or 1

    results = []
    seen_ct_topic = set()  # keep top results diverse
    rank = 1

    for ct, topic, day, raw in combos:
        key = (ct, topic)
        if key in seen_ct_topic:
            continue
        seen_ct_topic.add(key)

        norm_score = round(60 + 40 * (raw - min_score) / score_range, 1)

        reasons = _build_reasons(ct, topic, day, best_hour, ct_avg, top_avg, day_avg, overall_avg)

        results.append(RecommendationItem(
            rank=rank,
            content_type=ct,
            topic=topic,
            day=day,
            time_range=_hour_to_range(best_hour),
            score=norm_score,
            reasons=reasons,
        ))
        rank += 1
        if rank > top_n:
            break

    return RecommendationsResponse(recommendations=results)


def _build_reasons(ct, topic, day, best_hour, ct_avg, top_avg, day_avg, overall_avg) -> list[str]:
    reasons = []

    ct_rate = ct_avg.get(ct, overall_avg)
    if ct_rate > overall_avg:
        reasons.append(f"{ct} posts average {ct_rate:.1f}% engagement, above the overall average.")

    topic_rate = top_avg.get(topic, overall_avg)
    if topic_rate > overall_avg:
        reasons.append(f"'{topic}' content averages {topic_rate:.1f}% engagement.")

    day_rate = day_avg.get(day, overall_avg)
    if day_rate > overall_avg:
        reasons.append(f"{day} has higher-than-average engagement ({day_rate:.1f}%).")

    reasons.append(f"Posting around {best_hour:02d}:00 aligns with your peak engagement window.")

    return reasons[:4]  # cap at 4 reasons
