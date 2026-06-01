from typing import Literal

from pydantic import BaseModel, Field


SignalLabel = Literal["strong_watch", "watch", "neutral", "risk", "exclude"]
Confidence = Literal["A", "B", "C", "D"]
RiskLevel = Literal["low", "medium", "high"]


class ScoreBreakdown(BaseModel):
    price_signal_score: float
    news_event_score: float
    disclosure_score: float
    market_regime_score: float
    fundamental_score: float
    liquidity_score: float
    relative_strength_score: float
    risk_penalty: float


class BacktestContext(BaseModel):
    status: str
    sample_size: int
    summary: str


class SignalResponse(BaseModel):
    ticker: str
    company_name: str
    market: Literal["KR", "US", "GLOBAL"]
    exchange: str
    signal_date: str
    horizon_days: int = 5
    final_score: float = Field(ge=0, le=100)
    p_up: float = Field(ge=0, le=1)
    expected_return: float
    downside_risk: float
    confidence: Confidence
    risk_level: RiskLevel
    label: SignalLabel
    score_breakdown: ScoreBreakdown
    bullish_reasons: list[str]
    bearish_reasons: list[str]
    risk_flags: list[str]
    data_quality_flags: list[str]
    source_refs: list[str]
    sample_size: int
    backtest: BacktestContext
    created_at: str


class SignalListResponse(BaseModel):
    disclaimer: str
    signals: list[SignalResponse]

