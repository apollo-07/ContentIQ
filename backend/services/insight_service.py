"""
services/insight_service.py – Automatically generate insights from data patterns
"""

import pandas as pd
from sqlalchemy.orm import Session

from backend.models.post import Post
from backend.schemas.insights import InsightItem, InsightsResponse


def _posts_to_df(posts: list[Post]) -> pd.DataFrame:
    return pd.DataFrame([{
        "content_type": p.content_type,
        "topic": p.topic,
        "day_of_week": p.day_of_week,
        "posting_hour": p.posting_hour,
        "engagement_rate": p.engagement_rate,
        "hashtag_count": p.hashtag_count,
        "caption_length": p.caption_length,
    } for p in posts])


def get_insights(db: Session, user_id: int) -> InsightsResponse:
    posts = db.query(Post).filter(Post.user_id == user_id).all()
    if not posts:
        return InsightsResponse(insights=[])

    df = _posts_to_df(posts).dropna(subset=["engagement_rate"])

    insights: list[InsightItem] = []
    idx = 1

    if df.empty:
        return InsightsResponse(insights=[])

    overall_avg = df["engagement_rate"].mean()

    # ── 1. Best content type ──────────────────────────────────────────────────
    ct_avg = df.groupby("content_type")["engagement_rate"].mean()
    if len(ct_avg) > 1:
        best_ct = ct_avg.idxmax()
        worst_ct = ct_avg.idxmin()
        diff = ct_avg[best_ct] - ct_avg[worst_ct]
        impact = "high" if diff > 2 else "medium" if diff > 1 else "low"
        insights.append(InsightItem(
            id=idx, type="content",
            title=f"{best_ct} posts drive the most engagement",
            description=(
                f"{best_ct} posts average {ct_avg[best_ct]:.1f}% engagement rate, "
                f"{diff:.1f}% higher than {worst_ct} posts ({ct_avg[worst_ct]:.1f}%)."
            ),
            impact=impact,
        ))
        idx += 1

    # ── 2. Best topic ─────────────────────────────────────────────────────────
    topic_avg = df.groupby("topic")["engagement_rate"].mean()
    if len(topic_avg) > 1:
        best_topic = topic_avg.idxmax()
        diff = topic_avg[best_topic] - overall_avg
        impact = "high" if diff > 2 else "medium" if diff > 0.5 else "low"
        insights.append(InsightItem(
            id=idx, type="topic",
            title=f"'{best_topic}' is your top-performing topic",
            description=(
                f"Posts about {best_topic} achieve {topic_avg[best_topic]:.1f}% avg engagement, "
                f"{diff:.1f}% above your overall average."
            ),
            impact=impact,
        ))
        idx += 1

    # ── 3. Best posting day ───────────────────────────────────────────────────
    day_avg = df.groupby("day_of_week")["engagement_rate"].mean()
    if len(day_avg) > 1:
        best_day = day_avg.idxmax()
        worst_day = day_avg.idxmin()
        diff = day_avg[best_day] - day_avg[worst_day]
        impact = "high" if diff > 2 else "medium"
        insights.append(InsightItem(
            id=idx, type="timing",
            title=f"{best_day} is your best day to post",
            description=(
                f"Posts on {best_day} average {day_avg[best_day]:.1f}% engagement — "
                f"{diff:.1f}% more than {worst_day} ({day_avg[worst_day]:.1f}%)."
            ),
            impact=impact,
        ))
        idx += 1

    # ── 4. Best posting hour ──────────────────────────────────────────────────
    hour_avg = df.dropna(subset=["posting_hour"]).groupby("posting_hour")["engagement_rate"].mean()
    if not hour_avg.empty:
        best_hour = int(hour_avg.idxmax())
        insights.append(InsightItem(
            id=idx, type="timing",
            title=f"Peak engagement at {best_hour:02d}:00",
            description=(
                f"Posts published around {best_hour:02d}:00 achieve "
                f"{hour_avg[best_hour]:.1f}% avg engagement. "
                "Consider scheduling your best content for this window."
            ),
            impact="medium",
        ))
        idx += 1

    # ── 5. Hashtag sweet spot ─────────────────────────────────────────────────
    hash_df = df.dropna(subset=["hashtag_count"]).copy()
    if not hash_df.empty:
        hash_df["hashtag_bucket"] = pd.cut(
            hash_df["hashtag_count"], bins=[0, 5, 10, 20, 50],
            labels=["1-5", "6-10", "11-20", "21+"], right=True,
        )
        bucket_avg = hash_df.groupby("hashtag_bucket", observed=True)["engagement_rate"].mean()
        if not bucket_avg.empty:
            best_bucket = bucket_avg.idxmax()
            insights.append(InsightItem(
                id=idx, type="engagement",
                title=f"Hashtag sweet spot: {best_bucket} tags",
                description=(
                    f"Posts with {best_bucket} hashtags average "
                    f"{bucket_avg[best_bucket]:.1f}% engagement. "
                    "Too many or too few hashtags may reduce visibility."
                ),
                impact="medium",
            ))
            idx += 1

    # ── 6. Caption length impact ──────────────────────────────────────────────
    cap_df = df.dropna(subset=["caption_length"]).copy()
    if not cap_df.empty:
        cap_df["cap_bucket"] = pd.cut(
            cap_df["caption_length"], bins=[0, 50, 150, 300, 2200],
            labels=["Short (<50)", "Medium (50-150)", "Long (150-300)", "Very Long (300+)"],
            right=True,
        )
        cap_avg = cap_df.groupby("cap_bucket", observed=True)["engagement_rate"].mean()
        if not cap_avg.empty:
            best_cap = cap_avg.idxmax()
            insights.append(InsightItem(
                id=idx, type="content",
                title=f"{best_cap} captions perform best",
                description=(
                    f"Captions in the '{best_cap}' range achieve "
                    f"{cap_avg[best_cap]:.1f}% avg engagement. "
                    "Experiment with this length for your next posts."
                ),
                impact="low",
            ))
            idx += 1

    return InsightsResponse(insights=insights)
