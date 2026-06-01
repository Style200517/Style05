from typing import Literal

from pydantic import BaseModel, Field


class NewsEventClassification(BaseModel):
    ticker: str | None
    company_name: str | None
    is_relevant: bool
    entity_confidence: float = Field(ge=0, le=1)
    event_type: Literal[
        "earnings",
        "guidance",
        "contract",
        "mna",
        "buyback",
        "dividend",
        "offering",
        "debt",
        "lawsuit",
        "regulation",
        "product",
        "approval",
        "analyst_rating",
        "macro",
        "insider",
        "accounting",
        "rumor",
        "other",
    ]
    sentiment: Literal["positive", "negative", "neutral", "mixed", "unknown"]
    impact_direction: Literal["bullish", "bearish", "neutral", "mixed", "unknown"]
    impact_strength: int = Field(ge=0, le=5)
    time_horizon: Literal["intraday", "short", "short_to_mid", "mid", "long", "unknown"]
    novelty_score: float = Field(ge=0, le=1)
    source_quality: float = Field(ge=0, le=1)
    priced_in_risk: float = Field(ge=0, le=1)
    duplicate_risk: float = Field(ge=0, le=1)
    confidence: float = Field(ge=0, le=1)
    evidence: list[str]
    risk_flags: list[str]
    summary_for_user: str

