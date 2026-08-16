"""
ml/preprocessing.py – Data cleaning and feature engineering for the ML pipeline

Run standalone:
    python -m ml.preprocessing
"""

import pandas as pd
import numpy as np
from pathlib import Path

RAW_PATH       = Path("data/sample/sample_posts.csv")
PROCESSED_PATH = Path("data/processed/posts_clean.csv")
PROCESSED_PATH.parent.mkdir(parents=True, exist_ok=True)


# ── Constants ────────────────────────────────────────────────────────────────
NUMERIC_COLS = [
    "caption_length", "hashtag_count", "followers",
    "impressions", "reach", "views",
    "likes", "comments", "shares", "saves",
]

CATEGORICAL_COLS = ["content_type", "topic", "day_of_week"]

# Features used in ML (NO engagement metrics → no target leakage)
FEATURE_COLS = [
    "content_type", "topic", "day_of_week",
    "posting_hour", "caption_length", "hashtag_count", "followers",
]

TARGET_COL = "performance_label"


# ── Helpers ──────────────────────────────────────────────────────────────────

def compute_engagement_rate(df: pd.DataFrame) -> pd.Series:
    """engagement_rate = (likes + comments + shares + saves) / reach * 100"""
    interactions = df["likes"] + df["comments"] + df["shares"] + df["saves"]
    return (interactions / df["reach"].replace(0, np.nan) * 100).round(4)


def extract_posting_hour(posting_time: pd.Series) -> pd.Series:
    """Parse 'HH:MM' string → integer hour; returns NaN on failure."""
    return pd.to_datetime(posting_time, format="%H:%M", errors="coerce").dt.hour


def label_performance(engagement_rate: pd.Series) -> pd.Series:
    """
    Assign LOW / MEDIUM / HIGH using percentile thresholds.
    Percentile-based labelling avoids hard-coding arbitrary numbers.
    """
    low_thresh  = engagement_rate.quantile(0.33)
    high_thresh = engagement_rate.quantile(0.67)

    def _label(rate):
        if rate <= low_thresh:
            return "LOW"
        elif rate <= high_thresh:
            return "MEDIUM"
        else:
            return "HIGH"

    return engagement_rate.apply(_label)


# ── Main pipeline ─────────────────────────────────────────────────────────────

def load_and_clean(path: Path = RAW_PATH) -> pd.DataFrame:
    df = pd.read_csv(path)
    df.columns = [c.lower().strip() for c in df.columns]

    # ── 1. Remove full duplicates
    df = df.drop_duplicates()

    # ── 2. Coerce numerics
    for col in NUMERIC_COLS:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # ── 3. Fill missing engagement counts with 0
    for col in ["likes", "comments", "shares", "saves"]:
        df[col] = df[col].fillna(0)

    # ── 4. Drop rows with unusable reach (can't compute engagement rate)
    df = df[df["reach"].notna() & (df["reach"] > 0)].copy()

    # ── 5. Derived columns
    df["engagement_rate"] = compute_engagement_rate(df)
    df["posting_hour"]    = extract_posting_hour(df["posting_time"])

    # ── 6. Remove impossible engagement rates
    df = df[df["engagement_rate"] <= 100].copy()

    # ── 7. Fill missing categoricals
    for col in CATEGORICAL_COLS:
        df[col] = df[col].fillna("Unknown")

    # ── 8. Outlier clipping & imputation for feature columns
    for col in ["caption_length", "hashtag_count", "followers"]:
        q1, q3 = df[col].quantile(0.01), df[col].quantile(0.99)
        df[col] = df[col].clip(lower=q1, upper=q3)
        df[col] = df[col].fillna(df[col].median())

    if "posting_hour" in df.columns:
        df["posting_hour"] = df["posting_hour"].fillna(df["posting_hour"].median())

    # ── 9. Target label
    df[TARGET_COL] = label_performance(df["engagement_rate"])

    df = df.reset_index(drop=True)
    return df


def get_features_and_target(df: pd.DataFrame):
    """Return (X DataFrame, y Series) ready for sklearn."""
    X = df[FEATURE_COLS].copy()
    y = df[TARGET_COL].copy()
    return X, y


if __name__ == "__main__":
    df = load_and_clean()
    df.to_csv(PROCESSED_PATH, index=False)
    print(f"[SUCCESS] Cleaned {len(df)} rows -> {PROCESSED_PATH}")
    print(f"   Label distribution:\n{df[TARGET_COL].value_counts()}")
