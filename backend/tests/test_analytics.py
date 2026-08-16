"""
tests/test_analytics.py – Analytics endpoint tests
"""

import io
import pandas as pd
from fastapi.testclient import TestClient
from backend.tests.conftest import register_and_login, auth_headers


def _upload_sample(client, token, n=20):
    rows = []
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    cts  = ["Reel", "Image", "Story"]
    tops = ["Product", "Educational", "Behind the Scenes"]
    for i in range(n):
        rows.append({
            "post_id": f"P{i}", "date": f"2024-0{(i % 9) + 1}-{(i % 28) + 1:02d}",
            "content_type": cts[i % len(cts)],
            "topic": tops[i % len(tops)],
            "posting_time": f"{(i % 17) + 6:02d}:00",
            "day_of_week": days[i % 7],
            "caption_length": 100 + i, "hashtag_count": i % 15,
            "followers": 10000 + i * 100,
            "impressions": 5000, "reach": 4000, "views": 3000,
            "likes": 200 + i, "comments": 30, "shares": 20, "saves": 15,
        })
    df = pd.DataFrame(rows)
    buf = io.BytesIO()
    df.to_csv(buf, index=False)
    client.post(
        "/datasets/upload",
        files={"file": ("posts.csv", buf.getvalue(), "text/csv")},
        data={"name": "Analytics DS"},
        headers=auth_headers(token),
    )


def test_overview(client):
    token = register_and_login(client)
    _upload_sample(client, token)
    resp = client.get("/analytics/overview", headers=auth_headers(token))
    assert resp.status_code == 200
    data = resp.json()
    assert "total_posts" in data
    assert "average_engagement_rate" in data
    assert "best_content_type" in data
    assert "best_topic" in data
    assert "best_posting_time" in data
    assert data["total_posts"] == 20


def test_overview_no_data(client):
    token = register_and_login(client)
    resp = client.get("/analytics/overview", headers=auth_headers(token))
    assert resp.status_code == 200
    assert resp.json()["total_posts"] == 0


def test_content_types(client):
    token = register_and_login(client)
    _upload_sample(client, token)
    resp = client.get("/analytics/content-types", headers=auth_headers(token))
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert len(data) > 0
    first = data[0]
    assert "content_type" in first
    assert "post_count" in first
    assert "average_engagement_rate" in first
    assert "median_engagement_rate" in first


def test_topics(client):
    token = register_and_login(client)
    _upload_sample(client, token)
    resp = client.get("/analytics/topics", headers=auth_headers(token))
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert len(data) > 0
    assert "topic" in data[0]


def test_timing(client):
    token = register_and_login(client)
    _upload_sample(client, token)
    resp = client.get("/analytics/timing", headers=auth_headers(token))
    assert resp.status_code == 200
    body = resp.json()
    assert "day_data" in body
    assert "hour_data" in body
    assert len(body["day_data"]) > 0
    assert "day" in body["day_data"][0]
    assert "average_engagement_rate" in body["day_data"][0]


def test_trends(client):
    token = register_and_login(client)
    _upload_sample(client, token)
    resp = client.get("/analytics/trends", headers=auth_headers(token))
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert isinstance(data, list)
