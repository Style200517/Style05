from __future__ import annotations

import math
from dataclasses import dataclass
from datetime import datetime, timezone

from app.config import FEATURE_SET_VERSION, SCORING_VERSION
from app.sample_data import DailyPrice, Security
from app.schemas.signal_schema import BacktestContext, ScoreBreakdown, SignalResponse


KR_LIQUIDITY_THRESHOLD = 1_000_000_000
US_LIQUIDITY_THRESHOLD = 10_000_000
RISK_PENALTY_CAP = 35


@dataclass(frozen=True)
class PriceContext:
    bars: list[DailyPrice]
    index_bars: list[DailyPrice]


def calculate_signal(
    security: Security,
    bars: list[DailyPrice],
    index_bars: list[DailyPrice],
    horizon_days: int = 5,
) -> SignalResponse:
    bars = sorted(bars, key=lambda item: item.date)
    index_bars = sorted(index_bars, key=lambda item: item.date)
    data_quality_flags = _data_quality_flags(bars)
    latest = bars[-1] if bars else None
    threshold = _liquidity_threshold(security.market)
    avg_trading_value_20d = _avg([bar.trading_value for bar in bars[-20:]])
    low_liquidity = avg_trading_value_20d < threshold if bars else True

    if latest is None or len(bars) < 60 or latest.close is None or latest.volume is None or low_liquidity:
        reason = "데이터 또는 유동성 기준을 충족하지 못해 제외로 분류됩니다."
        flags = list(data_quality_flags)
        if low_liquidity:
            flags.append("거래대금 기준 미달")
        return _excluded_signal(security, bars, flags, reason, horizon_days)

    price_score, price_reasons, price_cautions = calculate_price_signal_score(bars)
    market_score, market_flags = calculate_market_regime_score(index_bars)
    liquidity_score = calculate_liquidity_score(security.market, avg_trading_value_20d)
    relative_strength_score = calculate_relative_strength_score(bars, index_bars)
    news_score = 50.0
    disclosure_score = 50.0
    fundamental_score = 50.0
    risk_penalty, risk_flags = calculate_risk_penalty(bars, index_bars, security.market, avg_trading_value_20d, data_quality_flags)
    risk_flags.extend(market_flags)

    base_score = (
        0.30 * price_score
        + 0.20 * market_score
        + 0.20 * news_score
        + 0.10 * fundamental_score
        + 0.10 * liquidity_score
        + 0.10 * relative_strength_score
    )
    final_score = _clamp(base_score - risk_penalty, 0, 100)
    confidence = calculate_confidence(bars, avg_trading_value_20d, threshold, risk_flags, price_score)
    label = assign_label(final_score, confidence, risk_flags)
    risk_level = _risk_level(risk_penalty, risk_flags)
    p_up = calculate_probability(final_score, confidence)
    expected_return = round(((final_score - 50) / 100) * 0.06, 4)
    downside_risk = round(_volatility(bars[-20:]) * math.sqrt(horizon_days) + (risk_penalty / 1000), 4)

    bullish_reasons = list(price_reasons)
    if relative_strength_score >= 60:
        bullish_reasons.append("시장 대비 상대강도가 양호합니다.")
    if liquidity_score >= 70:
        bullish_reasons.append("최근 거래대금이 MVP 기준을 충분히 상회합니다.")

    bearish_reasons = list(price_cautions)
    if risk_flags:
        bearish_reasons.append("리스크 플래그가 점수와 신뢰도에 반영됐습니다.")

    return SignalResponse(
        ticker=security.ticker,
        company_name=security.company_name,
        market=security.market,
        exchange=security.exchange,
        signal_date=str(latest.date),
        horizon_days=horizon_days,
        final_score=round(final_score, 2),
        p_up=p_up,
        expected_return=expected_return,
        downside_risk=downside_risk,
        confidence=confidence,
        risk_level=risk_level,
        label=label,
        score_breakdown=ScoreBreakdown(
            price_signal_score=round(price_score, 2),
            news_event_score=news_score,
            disclosure_score=disclosure_score,
            market_regime_score=round(market_score, 2),
            fundamental_score=fundamental_score,
            liquidity_score=round(liquidity_score, 2),
            relative_strength_score=round(relative_strength_score, 2),
            risk_penalty=round(risk_penalty, 2),
        ),
        bullish_reasons=bullish_reasons[:5],
        bearish_reasons=bearish_reasons[:5],
        risk_flags=sorted(set(risk_flags)),
        data_quality_flags=data_quality_flags,
        source_refs=["sample-mock:daily_prices", f"scoring:{SCORING_VERSION}", f"features:{FEATURE_SET_VERSION}"],
        sample_size=len(bars),
        backtest=BacktestContext(
            status="not_run_mvp1",
            sample_size=len(bars),
            summary="MVP 1은 샘플 데이터 기반 신호 계산 단계이며, 운영 신뢰도 평가는 백테스트와 페이퍼 트래킹 이후 판단합니다.",
        ),
        created_at=datetime.now(timezone.utc).isoformat(),
    )


def calculate_price_signal_score(bars: list[DailyPrice]) -> tuple[float, list[str], list[str]]:
    close = bars[-1].close
    ma5 = _avg_close(bars[-5:])
    ma20 = _avg_close(bars[-20:])
    ma60 = _avg_close(bars[-60:])
    recent_return_5d = _return(bars, 5)
    recent_return_20d = _return(bars, 20)
    volume_ratio_20d = bars[-1].volume / max(1, _avg([bar.volume for bar in bars[-20:]]))
    high_20d = max(bar.high for bar in bars[-20:])
    low_20d = min(bar.low for bar in bars[-20:])

    score = 50.0
    reasons: list[str] = []
    cautions: list[str] = []

    if close > ma5:
        score += 6
    if close > ma20:
        score += 10
        reasons.append("종가가 20일 평균 위에 있습니다.")
    else:
        score -= 8
        cautions.append("종가가 20일 평균 아래에 있습니다.")

    if close > ma60:
        score += 9
    if ma5 > ma20 > ma60:
        score += 12
        reasons.append("단기와 중기 평균선 정렬이 개선됐습니다.")
    if recent_return_5d > 0:
        score += min(12, recent_return_5d * 180)
        reasons.append("최근 5거래일 가격 흐름이 양호합니다.")
    else:
        score += max(-12, recent_return_5d * 160)
        cautions.append("최근 5거래일 가격 흐름이 약합니다.")

    if recent_return_20d > 0:
        score += min(8, recent_return_20d * 70)
    if close >= high_20d * 0.995:
        score += 10
        reasons.append("20일 고점권에 접근했습니다.")
    if close <= low_20d * 1.005:
        score -= 15
        cautions.append("20일 저점권에 근접했습니다.")
    if volume_ratio_20d >= 1.4 and recent_return_5d > 0:
        score += 8
        reasons.append("가격 상승과 거래량 증가가 함께 관찰됩니다.")
    if volume_ratio_20d < 0.75 and recent_return_5d > 0:
        score -= 6
        cautions.append("가격 흐름 대비 거래량 확인이 약합니다.")

    return _clamp(score, 0, 100), reasons, cautions


def calculate_market_regime_score(index_bars: list[DailyPrice]) -> tuple[float, list[str]]:
    if len(index_bars) < 60:
        return 45.0, ["시장지수 데이터 부족"]
    close = index_bars[-1].close
    ma20 = _avg_close(index_bars[-20:])
    ma60 = _avg_close(index_bars[-60:])
    ret5 = _return(index_bars, 5)
    score = 50.0
    flags: list[str] = []
    if close > ma20:
        score += 12
    if close > ma60:
        score += 12
    if ma20 > ma60:
        score += 8
    if ret5 < -0.04:
        score -= 20
        flags.append("시장 단기 약세")
    return _clamp(score, 0, 100), flags


def calculate_liquidity_score(market: str, avg_trading_value_20d: float) -> float:
    threshold = _liquidity_threshold(market)
    ratio = max(0.01, avg_trading_value_20d / threshold)
    return _clamp(45 + math.log10(ratio) * 28, 0, 100)


def calculate_relative_strength_score(bars: list[DailyPrice], index_bars: list[DailyPrice]) -> float:
    if len(bars) < 20 or len(index_bars) < 20:
        return 50.0
    spread_5d = _return(bars, 5) - _return(index_bars, 5)
    spread_20d = _return(bars, 20) - _return(index_bars, 20)
    return _clamp(50 + spread_5d * 360 + spread_20d * 160, 0, 100)


def calculate_risk_penalty(
    bars: list[DailyPrice],
    index_bars: list[DailyPrice],
    market: str,
    avg_trading_value_20d: float,
    data_quality_flags: list[str],
) -> tuple[float, list[str]]:
    penalty = 0.0
    flags: list[str] = []
    ret5 = _return(bars, 5)
    vol20 = _volatility(bars[-20:])
    low_20d = min(bar.low for bar in bars[-20:])
    latest = bars[-1]

    if ret5 >= 0.20:
        penalty += 10
        flags.append("단기 급등 후 추격 위험")
    if vol20 > 0.045:
        penalty += 10
        flags.append("20일 변동성 과도")
    elif vol20 > 0.030:
        penalty += 5
        flags.append("20일 변동성 상승")
    if avg_trading_value_20d < _liquidity_threshold(market):
        penalty += 15
        flags.append("거래대금 기준 미달")
    if latest.close <= low_20d * 1.005:
        penalty += 10
        flags.append("20일 저점 이탈 위험")
    if data_quality_flags:
        penalty += min(15, 5 * len(data_quality_flags))
        flags.extend(data_quality_flags)
    market_score, _ = calculate_market_regime_score(index_bars)
    if market_score < 40:
        penalty += 5
        flags.append("시장상황 약세")
    return min(RISK_PENALTY_CAP, penalty), flags


def calculate_confidence(
    bars: list[DailyPrice],
    avg_trading_value_20d: float,
    threshold: float,
    risk_flags: list[str],
    price_score: float,
) -> str:
    if len(bars) < 60 or avg_trading_value_20d < threshold or len(risk_flags) >= 4:
        return "D"
    if len(bars) >= 90 and avg_trading_value_20d >= threshold * 2 and len(risk_flags) <= 1 and price_score >= 55:
        return "A"
    if len(bars) >= 90 and len(risk_flags) <= 2:
        return "B"
    return "C"


def assign_label(final_score: float, confidence: str, risk_flags: list[str]) -> str:
    excessive_risk = len(risk_flags) >= 4 or confidence == "D"
    if excessive_risk:
        return "risk"
    if final_score >= 80 and confidence in {"A", "B"} and len(risk_flags) <= 2:
        return "strong_watch"
    if final_score >= 65:
        return "watch"
    if final_score >= 50:
        return "neutral"
    return "risk"


def calculate_probability(final_score: float, confidence: str) -> float:
    probability = 0.5 + (final_score - 50) / 220
    if confidence == "C":
        probability -= 0.03
    if confidence == "D":
        probability -= 0.08
    return round(_clamp(probability, 0.05, 0.95), 3)


def _excluded_signal(
    security: Security,
    bars: list[DailyPrice],
    flags: list[str],
    reason: str,
    horizon_days: int,
) -> SignalResponse:
    signal_date = str(bars[-1].date) if bars else ""
    return SignalResponse(
        ticker=security.ticker,
        company_name=security.company_name,
        market=security.market,
        exchange=security.exchange,
        signal_date=signal_date,
        horizon_days=horizon_days,
        final_score=0,
        p_up=0.05,
        expected_return=0,
        downside_risk=0,
        confidence="D",
        risk_level="high",
        label="exclude",
        score_breakdown=ScoreBreakdown(
            price_signal_score=0,
            news_event_score=50,
            disclosure_score=50,
            market_regime_score=0,
            fundamental_score=50,
            liquidity_score=0,
            relative_strength_score=0,
            risk_penalty=RISK_PENALTY_CAP,
        ),
        bullish_reasons=[],
        bearish_reasons=[reason],
        risk_flags=sorted(set(flags)),
        data_quality_flags=[flag for flag in flags if "데이터" in flag or "누락" in flag],
        source_refs=["sample-mock:daily_prices", f"scoring:{SCORING_VERSION}"],
        sample_size=len(bars),
        backtest=BacktestContext(status="not_run_mvp1", sample_size=len(bars), summary="제외 후보는 MVP 1 백테스트 대상에서 제외합니다."),
        created_at=datetime.now(timezone.utc).isoformat(),
    )


def _data_quality_flags(bars: list[DailyPrice]) -> list[str]:
    flags: list[str] = []
    if len(bars) < 60:
        flags.append("유효 일봉 60개 미만")
    if bars and (bars[-1].close is None or bars[-1].volume is None):
        flags.append("최근 가격 또는 거래량 누락")
    if not bars:
        flags.append("가격 데이터 없음")
    return flags


def _risk_level(risk_penalty: float, risk_flags: list[str]) -> str:
    if risk_penalty >= 25 or len(risk_flags) >= 3:
        return "high"
    if risk_penalty >= 10 or risk_flags:
        return "medium"
    return "low"


def _liquidity_threshold(market: str) -> float:
    return KR_LIQUIDITY_THRESHOLD if market == "KR" else US_LIQUIDITY_THRESHOLD


def _return(bars: list[DailyPrice], window: int) -> float:
    if len(bars) <= window:
        return 0.0
    start = bars[-window - 1].close
    end = bars[-1].close
    return (end / start) - 1 if start else 0.0


def _volatility(bars: list[DailyPrice]) -> float:
    if len(bars) < 2:
        return 0.0
    returns = [(bars[index].close / bars[index - 1].close) - 1 for index in range(1, len(bars)) if bars[index - 1].close]
    if not returns:
        return 0.0
    mean = sum(returns) / len(returns)
    variance = sum((value - mean) ** 2 for value in returns) / len(returns)
    return math.sqrt(variance)


def _avg_close(bars: list[DailyPrice]) -> float:
    return _avg([bar.close for bar in bars])


def _avg(values: list[float | int]) -> float:
    return float(sum(values) / len(values)) if values else 0.0


def _clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(upper, value))

