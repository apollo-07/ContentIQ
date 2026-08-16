"""
schemas/predict.py – Request/Response schemas for /predict and /simulate
"""

from pydantic import BaseModel, Field


# ── /predict ──────────────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    content_type: str = Field(..., examples=["Reel"])
    topic: str = Field(..., examples=["Product"])
    day_of_week: str = Field(..., examples=["Saturday"])
    posting_hour: int = Field(..., ge=0, le=23, examples=[20])
    caption_length: int = Field(..., ge=0, examples=[120])
    hashtag_count: int = Field(..., ge=0, examples=[5])
    followers: int = Field(..., ge=0, examples=[10000])


class PredictResponse(BaseModel):
    prediction: str          # LOW | MEDIUM | HIGH
    probability: float
    model: str
    recommendations: list[str]


# ── /simulate ─────────────────────────────────────────────────────────────────
class ScenarioRequest(BaseModel):
    name: str
    content_type: str
    topic: str
    day_of_week: str
    posting_hour: int = Field(..., ge=0, le=23)
    caption_length: int = Field(..., ge=0)
    hashtag_count: int = Field(..., ge=0)
    followers: int = Field(..., ge=0)


class SimulateRequest(BaseModel):
    scenarios: list[ScenarioRequest]


class ScenarioResult(BaseModel):
    name: str
    prediction: str
    probability: float


class SimulateResponse(BaseModel):
    results: list[ScenarioResult]
