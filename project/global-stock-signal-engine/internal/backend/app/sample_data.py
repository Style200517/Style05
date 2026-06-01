from __future__ import annotations

import math
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta, timezone
from typing import Literal


Market = Literal["KR", "US"]


@dataclass(frozen=True)
class Security:
    id: int
    ticker: str
    market: Market
    exchange: str
    company_name: str
    company_name_kr: str | None
    country: str
    currency: str
    sector: str
    industry: str
    active: bool = True


@dataclass(frozen=True)
class DailyPrice:
    security_id: int
    ticker: str
    date: date
    open: float
    high: float
    low: float
    close: float
    adjusted_close: float
    volume: int
    trading_value: float
    source: str
    as_of_time: datetime


@dataclass(frozen=True)
class SecurityProfile:
    base_price: float
    drift: float
    wave: float
    volume_base: int
    scenario: str


SAMPLE_TODAY = date(2026, 5, 8)


SECURITIES: list[Security] = [
    Security(1, "005930", "KR", "KOSPI", "Samsung Electronics", "삼성전자", "KR", "KRW", "Technology", "Semiconductors"),
    Security(2, "000660", "KR", "KOSPI", "SK hynix", "SK하이닉스", "KR", "KRW", "Technology", "Semiconductors"),
    Security(3, "035420", "KR", "KOSPI", "NAVER", "네이버", "KR", "KRW", "Communication", "Internet"),
    Security(4, "035720", "KR", "KOSPI", "Kakao", "카카오", "KR", "KRW", "Communication", "Internet"),
    Security(5, "091990", "KR", "KOSDAQ", "Celltrion Healthcare", "셀트리온헬스케어", "KR", "KRW", "Healthcare", "Biotech"),
    Security(6, "333333", "KR", "KOSDAQ", "Sample Nano Materials", "샘플나노소재", "KR", "KRW", "Materials", "Specialty Chemicals"),
    Security(7, "AAPL", "US", "NASDAQ", "Apple", None, "US", "USD", "Technology", "Consumer Electronics"),
    Security(8, "MSFT", "US", "NASDAQ", "Microsoft", None, "US", "USD", "Technology", "Software"),
    Security(9, "NVDA", "US", "NASDAQ", "NVIDIA", None, "US", "USD", "Technology", "Semiconductors"),
    Security(10, "TSLA", "US", "NASDAQ", "Tesla", None, "US", "USD", "Consumer Cyclical", "Automobiles"),
    Security(11, "GE", "US", "NYSE", "GE Aerospace", None, "US", "USD", "Industrials", "Aerospace"),
    Security(12, "SMLC", "US", "AMEX", "Sample Micro Cap", None, "US", "USD", "Technology", "Hardware"),
]


PROFILES: dict[str, SecurityProfile] = {
    "005930": SecurityProfile(76000, 0.0008, 0.018, 14_000_000, "steady_breakout"),
    "000660": SecurityProfile(182000, 0.0016, 0.022, 4_800_000, "strong_momentum"),
    "035420": SecurityProfile(205000, 0.0002, 0.018, 850_000, "neutral"),
    "035720": SecurityProfile(62000, -0.0007, 0.025, 2_100_000, "breakdown"),
    "091990": SecurityProfile(71000, 0.0011, 0.035, 1_300_000, "volatile_watch"),
    "333333": SecurityProfile(4500, 0.0012, 0.030, 18_000, "low_liquidity"),
    "AAPL": SecurityProfile(190, 0.0005, 0.014, 54_000_000, "steady_breakout"),
    "MSFT": SecurityProfile(415, 0.0007, 0.012, 25_000_000, "steady_breakout"),
    "NVDA": SecurityProfile(880, 0.0019, 0.032, 43_000_000, "runup"),
    "TSLA": SecurityProfile(190, 0.0001, 0.050, 88_000_000, "volatile_watch"),
    "GE": SecurityProfile(160, 0.0009, 0.018, 7_500_000, "neutral"),
    "SMLC": SecurityProfile(8.5, 0.0005, 0.035, 120_000, "low_liquidity"),
}


INDEX_PROFILES: dict[Market, SecurityProfile] = {
    "KR": SecurityProfile(2700, 0.0002, 0.010, 1, "market_neutral"),
    "US": SecurityProfile(5200, 0.0004, 0.009, 1, "market_positive"),
}


def business_days(end: date = SAMPLE_TODAY, count: int = 100) -> list[date]:
    days: list[date] = []
    current = end
    while len(days) < count:
        if current.weekday() < 5:
            days.append(current)
        current -= timedelta(days=1)
    return list(reversed(days))


def as_observed_at(day: date, market: Market) -> datetime:
    close_time = time(15, 45) if market == "KR" else time(21, 0)
    return datetime.combine(day, close_time, tzinfo=timezone.utc)


def generate_daily_prices(security: Security, days: int = 100) -> list[DailyPrice]:
    profile = PROFILES[security.ticker]
    output: list[DailyPrice] = []
    dates = business_days(count=days)
    last_close = profile.base_price

    for idx, day in enumerate(dates):
        trend = 1 + profile.drift * idx
        wave = 1 + profile.wave * math.sin(idx / 5.0)
        scenario_boost = _scenario_boost(profile.scenario, idx, len(dates))
        close = max(0.5, profile.base_price * trend * wave * scenario_boost)
        open_price = (last_close * 0.35) + (close * 0.65)
        high = max(open_price, close) * (1 + 0.006 + abs(math.sin(idx / 7.0)) * 0.006)
        low = min(open_price, close) * (1 - 0.006 - abs(math.cos(idx / 6.0)) * 0.005)
        volume_wave = 1 + 0.18 * math.sin(idx / 4.0)
        volume_boost = _volume_boost(profile.scenario, idx, len(dates))
        volume = max(1, int(profile.volume_base * volume_wave * volume_boost))
        trading_value = volume * close
        output.append(
            DailyPrice(
                security_id=security.id,
                ticker=security.ticker,
                date=day,
                open=round(open_price, 4),
                high=round(high, 4),
                low=round(low, 4),
                close=round(close, 4),
                adjusted_close=round(close, 4),
                volume=volume,
                trading_value=round(trading_value, 2),
                source="sample-mock",
                as_of_time=as_observed_at(day, security.market),
            )
        )
        last_close = close
    return output


def generate_index_prices(market: Market, days: int = 100) -> list[DailyPrice]:
    security = Security(-1 if market == "KR" else -2, f"{market}-INDEX", market, "INDEX", f"{market} Sample Index", None, market, "KRW" if market == "KR" else "USD", "Market", "Index")
    profile = INDEX_PROFILES[market]
    output: list[DailyPrice] = []
    dates = business_days(count=days)
    last_close = profile.base_price
    for idx, day in enumerate(dates):
        trend = 1 + profile.drift * idx
        wave = 1 + profile.wave * math.sin(idx / 9.0)
        close = profile.base_price * trend * wave
        open_price = (last_close * 0.5) + (close * 0.5)
        output.append(
            DailyPrice(
                security_id=security.id,
                ticker=security.ticker,
                date=day,
                open=round(open_price, 4),
                high=round(max(open_price, close) * 1.004, 4),
                low=round(min(open_price, close) * 0.996, 4),
                close=round(close, 4),
                adjusted_close=round(close, 4),
                volume=1,
                trading_value=close,
                source="sample-index",
                as_of_time=as_observed_at(day, market),
            )
        )
        last_close = close
    return output


def get_security_by_ticker(ticker: str) -> Security | None:
    normalized = ticker.upper()
    return next((security for security in SECURITIES if security.ticker.upper() == normalized), None)


def get_prices_by_ticker(ticker: str) -> list[DailyPrice]:
    security = get_security_by_ticker(ticker)
    if security is None:
        return []
    return generate_daily_prices(security)


def get_index_prices(market: Market) -> list[DailyPrice]:
    return generate_index_prices(market)


def _scenario_boost(scenario: str, idx: int, total: int) -> float:
    tail = idx - (total - 8)
    if scenario == "strong_momentum" and idx > total - 28:
        return 1 + 0.0018 * (idx - (total - 28))
    if scenario == "steady_breakout" and idx > total - 18:
        return 1 + 0.0012 * (idx - (total - 18))
    if scenario == "runup" and tail > 0:
        return 1 + 0.032 * tail
    if scenario == "breakdown" and idx > total - 18:
        return max(0.78, 1 - 0.006 * (idx - (total - 18)))
    if scenario == "volatile_watch":
        return 1 + 0.028 * math.sin(idx / 2.3)
    return 1.0


def _volume_boost(scenario: str, idx: int, total: int) -> float:
    if scenario in {"strong_momentum", "steady_breakout"} and idx > total - 12:
        return 1.55
    if scenario == "runup" and idx > total - 8:
        return 2.1
    if scenario == "breakdown" and idx > total - 8:
        return 1.8
    if scenario == "volatile_watch" and idx % 11 == 0:
        return 1.9
    return 1.0

