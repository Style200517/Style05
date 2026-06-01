from typing import Literal

from pydantic import BaseModel, Field


class DisclosureEventClassification(BaseModel):
    ticker: str
    company_name: str
    disclosure_type: str
    event_type: Literal[
        "earnings",
        "contract",
        "offering",
        "buyback",
        "dividend",
        "mna",
        "lawsuit",
        "accounting",
        "delisting_risk",
        "management",
        "other",
    ]
    impact_direction: Literal["bullish", "bearish", "neutral", "mixed", "unknown"]
    impact_strength: int = Field(ge=0, le=5)
    time_horizon: Literal["short", "short_to_mid", "mid", "long", "unknown"]
    confidence: float = Field(ge=0, le=1)
    evidence: list[str]
    risk_flags: list[str]
    summary_for_user: str

