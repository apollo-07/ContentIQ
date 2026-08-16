"""
tests/test_insights.py – Insights and recommendations endpoint tests
"""

import io
import pandas as pd
from fastapi.testclient import TestClient
from backend.tests.conftest import register_and_login, auth_headers


def _upload_sample(client, token, n=30):
    rows = []
    cts  = ["Reel", "Image", "Story", "Carousel"]
    tops = ["Product", "Educational", "Behind the Scenes", "Tutorial"]
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    for i in range(n):
        rows.append({
            "post_id": f"P{i}", "date": "2024-03-01",
            "content_type": cts[i % len(cts)],
            "topic": tops[i % len(tops)],
            "posting_time": f"{(i % 17) + 6:02d}:00",
            "day_of_week": days[i % 7],
            "caption_length": 80 + i * 2, "hashtag_count": i % 20,
            "followers": 5000 + i * 200,
            "impressions": 6000, "reach": 5000, "views": 4000,
            "likes": 150 + i * 3, "comments": 20, "shares": 10, "saves": 8,
        })
    df = pd.DataFrame(rows)
    buf = io.BytesIO()
    df.to_csv(buf, index=False)
    client.post(
        "/datasets/upload",
        files={"file": ("posts.csv", buf.getvalue(), "text/csv")},
        data={"name": "Insights DS"},
        headers=auth_headers(token),
    )


def test_insights_returns_list(client):
    token = register_and_login(client)
    _upload_sample(client, token)
    resp = client.get("/insights", headers=auth_headers(token))
    assert resp.status_code == 200
    body = resp.json()
    assert "insights" in body
    insights = body["insights"]
    assert isinstance(insights, list)
    assert len(insights) > 0


def test_insights_structure(client):
    token = register_and_login(client)
    _upload_sample(client, token)
    resp = client.get("/insights", headers=auth_headers(token))
    first = resp.json()["insights"][0]
    assert "id" in first
    assert "type" in first
    assert "title" in first
    assert "description" in first
    assert "impact" in first
    assert first["impact"] in ("high", "medium", "low")


def test_insights_empty_data(client):
    token = register_and_login(client)
    resp = client.get("/insights", headers=auth_headers(token))
    assert resp.status_code == 200
    assert resp.json()["insights"] == []


def test_recommendations_returns_list(client):
    token = register_and_login(client)
    _upload_sample(client, token)
    resp = client.get("/recommendations", headers=auth_headers(token))
    assert resp.status_code == 200
    body = resp.json()
    assert "recommendations" in body
    recs = body["recommendations"]
    assert isinstance(recs, list)
    assert len(recs) > 0


def test_recommendations_structure(client):
    token = register_and_login(client)
    _upload_sample(client, token)
    resp = client.get("/recommendations", headers=auth_headers(token))
    first = resp.json()["recommendations"][0]
    assert "rank" in first
    assert "content_type" in first
    assert "topic" in first
    assert "day" in first
    assert "time_range" in first
    assert "score" in first
    assert "reasons" in first
    assert isinstance(first["reasons"], list)


def test_recommendations_ranked(client):
    """Recommendations should be in rank order."""
    token = register_and_login(client)
    _upload_sample(client, token)
    resp = client.get("/recommendations", headers=auth_headers(token))
    recs = resp.json()["recommendations"]
    ranks = [r["rank"] for r in recs]
    assert ranks == sorted(ranks)
