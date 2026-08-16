"""
schemas/strategy.py – Response schema for /strategy
"""

from pydantic import BaseModel


class StrategyItem(BaseModel):
    day: str
    content_type: str
    topic: str
    time_range: str
    score: float


class StrategyResponse(BaseModel):
    strategy: list[StrategyItem]
