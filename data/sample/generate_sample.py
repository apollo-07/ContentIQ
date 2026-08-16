"""
data/sample/generate_sample.py – Generates a realistic 500-row synthetic dataset

Run:
    python data/sample/generate_sample.py
"""

import numpy as np
import pandas as pd
from pathlib import Path

OUT_PATH = Path("data/sample/sample_posts.csv")
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

rng = np.random.default_rng(42)

N = 500

# ── Categorical pools ────────────────────────────────────────────────────────
CONTENT_TYPES = ["Reel", "Image", "Story", "Carousel", "Video"]
TOPICS = [
    "Product", "Educational", "Behind the Scenes", "User Generated",
    "Tutorial", "Entertainment", "Promotional", "Seasonal",
]
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# ── Engagement multipliers (to make data realistic, not random noise) ────────
# Higher engagement for Reels and certain topics
CT_WEIGHTS = {"Reel": 1.5, "Image": 1.0, "Story": 0.8, "Carousel": 1.2, "Video": 1.3}
TOPIC_WEIGHTS = {
    "Behind the Scenes": 1.4, "Educational": 1.2, "Tutorial": 1.3,
    "Product": 1.0, "User Generated": 1.1, "Entertainment": 1.3,
    "Promotional": 0.8, "Seasonal": 1.0,
}
DAY_WEIGHTS = {
    "Monday": 0.9, "Tuesday": 1.0, "Wednesday": 1.1,
    "Thursday": 1.2, "Friday": 1.1, "Saturday": 1.3, "Sunday": 1.2,
}
# Hours with better engagement (evening / lunch)
def hour_weight(h):
    if 12 <= h <= 13:
        return 1.1
    if 17 <= h <= 21:
        return 1.3
    return 0.85


# ── Generate rows ─────────────────────────────────────────────────────────────
content_types = rng.choice(CONTENT_TYPES, N, p=[0.30, 0.25, 0.20, 0.15, 0.10])
topics        = rng.choice(TOPICS, N)
days          = rng.choice(DAYS, N)
posting_hours = rng.integers(6, 23, N)
posting_times = [f"{h:02d}:{rng.integers(0, 59):02d}" for h in posting_hours]
caption_lengths = rng.integers(20, 400, N)
hashtag_counts  = rng.integers(0, 30, N)
followers       = rng.integers(1000, 500_000, N)

# Dates spread over the last 2 years
start_date = pd.Timestamp("2023-01-01")
dates = [
    (start_date + pd.Timedelta(days=int(rng.integers(0, 730)))).strftime("%Y-%m-%d")
    for _ in range(N)
]

# ── Compute reach and engagement metrics ──────────────────────────────────────
reach_base  = (followers * rng.uniform(0.05, 0.40, N)).astype(int)
impressions = (reach_base * rng.uniform(1.0, 1.8, N)).astype(int)
views       = (reach_base * rng.uniform(0.3, 0.9, N)).astype(int)

# Build engagement multiplier per row
multipliers = np.array([
    CT_WEIGHTS[ct] * TOPIC_WEIGHTS[top] * DAY_WEIGHTS[day] * hour_weight(h)
    for ct, top, day, h in zip(content_types, topics, days, posting_hours)
])

# Base engagement rate (%) before noise
base_er = multipliers * rng.uniform(2.0, 6.0, N)
base_er = np.clip(base_er + rng.normal(0, 0.5, N), 0.1, 40.0)

# Back-calculate interactions from engagement rate
total_interactions = (base_er / 100 * reach_base).astype(int)

# Split interactions into likes, comments, shares, saves
likes    = (total_interactions * rng.uniform(0.55, 0.70, N)).astype(int)
comments = (total_interactions * rng.uniform(0.05, 0.15, N)).astype(int)
shares   = (total_interactions * rng.uniform(0.05, 0.15, N)).astype(int)
saves    = (total_interactions - likes - comments - shares).clip(0)

# Recompute ground-truth engagement_rate
engagement_rate = ((likes + comments + shares + saves) / reach_base * 100).round(4)

# ── Post IDs ──────────────────────────────────────────────────────────────────
post_ids = [f"POST_{i:04d}" for i in range(1, N + 1)]

# ── Introduce realistic missingness (~3%) ─────────────────────────────────────
def add_nulls(arr, frac=0.03):
    arr = arr.astype(object)
    mask = rng.random(len(arr)) < frac
    arr[mask] = np.nan
    return arr

caption_lengths = add_nulls(caption_lengths.astype(object))
hashtag_counts  = add_nulls(hashtag_counts.astype(object))

# ── Assemble DataFrame ────────────────────────────────────────────────────────
df = pd.DataFrame({
    "post_id":        post_ids,
    "date":           dates,
    "content_type":   content_types,
    "topic":          topics,
    "posting_time":   posting_times,
    "day_of_week":    days,
    "caption_length": caption_lengths,
    "hashtag_count":  hashtag_counts,
    "followers":      followers,
    "impressions":    impressions,
    "reach":          reach_base,
    "views":          views,
    "likes":          likes,
    "comments":       comments,
    "shares":         shares,
    "saves":          saves,
})

df.to_csv(OUT_PATH, index=False)
print(f"[SUCCESS] Generated {N} rows -> {OUT_PATH}")
print(df.describe())
