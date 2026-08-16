# ContentIQ API Contract

> **For Developer 2 (React Frontend)**
> All endpoints, request shapes, response shapes, and error formats are documented here.
> Do NOT rename any endpoint path or response field without coordinating with Developer 1.

---

## Base URL

| Environment | Base URL |
|---|---|
| Development | `http://localhost:8000` |
| Production | TBD |

## Authentication

All endpoints except `/auth/register` and `/auth/login` require:

```
Authorization: Bearer <access_token>
```

---

## Error Responses

All errors follow this shape:

```json
{ "detail": "Human-readable error message" }
```

| HTTP Status | Meaning |
|---|---|
| 400 | Bad request (validation failed, duplicate) |
| 401 | Unauthorized (invalid/missing/expired token) |
| 403 | Forbidden (no credentials sent at all) |
| 404 | Resource not found |
| 422 | Unprocessable Entity (Pydantic validation error) |
| 503 | Service Unavailable (ML model not trained yet) |

---

## Auth Endpoints

### POST /auth/register

Create a new user account.

**Request:**
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "mypassword"
}
```

**Response (201):**
```json
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com"
}
```

**Errors:** 400 (email taken), 400 (username taken), 422 (password < 6 chars)

---

### POST /auth/login

**Request:**
```json
{
  "email": "alice@example.com",
  "password": "mypassword"
}
```

**Response (200):**
```json
{
  "access_token": "<JWT>",
  "token_type": "bearer"
}
```

**Errors:** 401 (wrong credentials)

---

## Dataset Endpoints

### POST /datasets/upload

Upload a CSV file. `multipart/form-data`.

**Form fields:**
- `file` (file, required) – CSV file
- `name` (string, required) – Dataset name
- `description` (string, optional) – Description

**Required CSV columns:** `post_id, date, content_type, topic, posting_time, day_of_week, caption_length, hashtag_count, followers, impressions, reach, views, likes, comments, shares, saves`

**Response (201):**
```json
{
  "id": 1,
  "name": "My Dataset",
  "description": "January posts",
  "row_count": 500,
  "status": "ready",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Errors:** 400 (missing columns, unreadable file)

---

### GET /datasets

Returns all datasets for the current user.

**Response (200):**
```json
{
  "datasets": [
    {
      "id": 1,
      "name": "My Dataset",
      "description": "January posts",
      "row_count": 500,
      "status": "ready",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### GET /datasets/{dataset_id}

**Response (200):** Same shape as single dataset object above.

**Errors:** 404 (not found / not owned by current user)

---

## Analytics Endpoints

### GET /analytics/overview

**Response (200):**
```json
{
  "total_posts": 500,
  "average_engagement_rate": 6.82,
  "total_engagement": 45231,
  "best_content_type": "Reel",
  "best_topic": "Behind the Scenes",
  "best_posting_time": "19:00-21:00"
}
```

---

### GET /analytics/content-types

**Response (200):**
```json
{
  "data": [
    {
      "content_type": "Reel",
      "post_count": 180,
      "average_engagement_rate": 8.2,
      "median_engagement_rate": 7.9
    }
  ]
}
```

Sorted by `average_engagement_rate` descending.

---

### GET /analytics/topics

**Response (200):**
```json
{
  "data": [
    {
      "topic": "Product",
      "post_count": 80,
      "average_engagement_rate": 7.4,
      "median_engagement_rate": 7.1
    }
  ]
}
```

---

### GET /analytics/timing

**Response (200):**
```json
{
  "day_data": [
    { "day": "Monday", "average_engagement_rate": 5.8 },
    { "day": "Tuesday", "average_engagement_rate": 6.1 }
  ],
  "hour_data": [
    { "hour": 19, "average_engagement_rate": 8.2 },
    { "hour": 20, "average_engagement_rate": 7.9 }
  ]
}
```

`day_data` is ordered Monday → Sunday. `hour_data` is ordered 0 → 23.

---

### GET /analytics/trends

Weekly engagement over time.

**Response (200):**
```json
{
  "data": [
    {
      "date": "2024-01-01",
      "average_engagement_rate": 6.5,
      "post_count": 12
    }
  ]
}
```

`date` is the Monday of each calendar week (`YYYY-MM-DD`).

---

## Insights & Recommendations

### GET /insights

**Response (200):**
```json
{
  "insights": [
    {
      "id": 1,
      "type": "content",
      "title": "Reels perform better",
      "description": "Reels have higher engagement than image posts.",
      "impact": "high"
    }
  ]
}
```

`type` values: `content | timing | topic | engagement`
`impact` values: `high | medium | low`

---

### GET /recommendations

**Response (200):**
```json
{
  "recommendations": [
    {
      "rank": 1,
      "content_type": "Reel",
      "topic": "Behind the Scenes",
      "day": "Saturday",
      "time_range": "19:00-21:00",
      "score": 87.0,
      "reasons": [
        "Reels average 8.2% engagement, above the overall average.",
        "Saturday has higher-than-average engagement (7.8%)."
      ]
    }
  ]
}
```

Results are sorted by `rank` ascending (rank 1 = best).

---

## Prediction Endpoints

### POST /predict

**Request:**
```json
{
  "content_type": "Reel",
  "topic": "Product",
  "day_of_week": "Saturday",
  "posting_hour": 20,
  "caption_length": 120,
  "hashtag_count": 5,
  "followers": 10000
}
```

> ⚠️ Do NOT include engagement metrics (likes, shares, etc.) – those are outputs, not inputs.

**Response (200):**
```json
{
  "prediction": "HIGH",
  "probability": 0.78,
  "model": "RandomForest",
  "recommendations": [
    "Consider posting between 17:00 and 22:00 for higher engagement."
  ]
}
```

`prediction` values: `LOW | MEDIUM | HIGH`

**Errors:** 503 (model not trained)

---

### POST /simulate

**Request:**
```json
{
  "scenarios": [
    {
      "name": "Scenario A",
      "content_type": "Reel",
      "topic": "Product",
      "day_of_week": "Saturday",
      "posting_hour": 20,
      "caption_length": 100,
      "hashtag_count": 5,
      "followers": 10000
    },
    {
      "name": "Scenario B",
      "content_type": "Image",
      "topic": "Educational",
      "day_of_week": "Monday",
      "posting_hour": 9,
      "caption_length": 50,
      "hashtag_count": 2,
      "followers": 5000
    }
  ]
}
```

**Response (200):**
```json
{
  "results": [
    { "name": "Scenario A", "prediction": "HIGH", "probability": 0.78 },
    { "name": "Scenario B", "prediction": "MEDIUM", "probability": 0.55 }
  ]
}
```

---

## Strategy Endpoint

### GET /strategy

Returns a 7-day (Monday → Sunday) content calendar.

**Response (200):**
```json
{
  "strategy": [
    {
      "day": "Monday",
      "content_type": "Educational",
      "topic": "Tutorial",
      "time_range": "18:00-20:00",
      "score": 82.0
    },
    {
      "day": "Tuesday",
      "content_type": "Reel",
      "topic": "Behind the Scenes",
      "time_range": "19:00-21:00",
      "score": 88.5
    }
  ]
}
```

`score` is 0–100. Always returns 7 items (one per day).

---

## Health Check

### GET /health

No auth required.

**Response (200):**
```json
{ "status": "ok", "version": "1.0.0" }
```

---

## Interactive Docs

When the backend is running:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Change Log

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2024 | Initial contract |
