"""
tests/test_isolation.py – User data isolation tests

Verifies that User A cannot see User B's datasets, posts, or analytics.
"""

import io
import pandas as pd
from fastapi.testclient import TestClient
from backend.tests.conftest import auth_headers

VALID_ROW = {
    "post_id": "P001", "date": "2024-01-15", "content_type": "Reel",
    "topic": "Product", "posting_time": "19:00", "day_of_week": "Monday",
    "caption_length": 120, "hashtag_count": 5, "followers": 10000,
    "impressions": 5000, "reach": 4000, "views": 3000,
    "likes": 200, "comments": 30, "shares": 20, "saves": 15,
}


def _register_and_login(client, email, username, password="pass1234"):
    client.post("/auth/register", json={"username": username, "email": email, "password": password})
    resp = client.post("/auth/login", json={"email": email, "password": password})
    return resp.json()["access_token"]


def _upload(client, token, name="DS"):
    df = pd.DataFrame([VALID_ROW] * 5)
    buf = io.BytesIO()
    df.to_csv(buf, index=False)
    return client.post(
        "/datasets/upload",
        files={"file": ("posts.csv", buf.getvalue(), "text/csv")},
        data={"name": name},
        headers=auth_headers(token),
    ).json()


def test_user_cannot_see_other_users_datasets(client):
    token_a = _register_and_login(client, "a@example.com", "userA")
    token_b = _register_and_login(client, "b@example.com", "userB")

    # A uploads a dataset
    ds_a = _upload(client, token_a, "User A Dataset")
    ds_id = ds_a["id"]

    # B should see 0 datasets
    resp = client.get("/datasets", headers=auth_headers(token_b))
    assert resp.json()["datasets"] == []

    # B cannot fetch A's dataset by ID
    resp = client.get(f"/datasets/{ds_id}", headers=auth_headers(token_b))
    assert resp.status_code == 404


def test_analytics_isolated_per_user(client):
    token_a = _register_and_login(client, "a2@example.com", "userA2")
    token_b = _register_and_login(client, "b2@example.com", "userB2")

    _upload(client, token_a, "A's data")

    # B's analytics should show 0 posts even though A has data
    resp = client.get("/analytics/overview", headers=auth_headers(token_b))
    assert resp.json()["total_posts"] == 0


def test_insights_isolated_per_user(client):
    token_a = _register_and_login(client, "a3@example.com", "userA3")
    token_b = _register_and_login(client, "b3@example.com", "userB3")

    _upload(client, token_a, "A's data")

    # B should get empty insights
    resp = client.get("/insights", headers=auth_headers(token_b))
    assert resp.json()["insights"] == []


def test_recommendations_isolated_per_user(client):
    token_a = _register_and_login(client, "a4@example.com", "userA4")
    token_b = _register_and_login(client, "b4@example.com", "userB4")

    _upload(client, token_a, "A's data")

    # B should get empty recommendations
    resp = client.get("/recommendations", headers=auth_headers(token_b))
    assert resp.json()["recommendations"] == []
