from app.collectors.mock_collector import MockMarketDataCollector
from app.config import DISCLAIMER_KO
from app.sample_data import DailyPrice, Security
from app.schemas.signal_schema import SignalListResponse, SignalResponse
from app.schemas.stock_schema import DailyPriceResponse, StockDetailResponse, StockResponse
from app.services.scoring_service import calculate_signal


collector = MockMarketDataCollector()


def list_stocks(market: str | None = None) -> list[StockResponse]:
    securities = collector.list_securities()
    if market:
        securities = [security for security in securities if security.market == market]
    return [_stock_response(security) for security in securities]


def get_stock_detail(ticker: str) -> StockDetailResponse | None:
    security = _find_security(ticker)
    if security is None:
        return None
    prices = collector.get_daily_prices(security.ticker)
    return StockDetailResponse(stock=_stock_response(security), prices=[_price_response(price) for price in prices[-90:]])


def list_today_signals(market: str | None = None, label: str | None = None, min_score: float | None = None) -> SignalListResponse:
    signals = [_signal_for_security(security) for security in collector.list_securities()]
    if market:
        signals = [signal for signal in signals if signal.market == market]
    if label:
        signals = [signal for signal in signals if signal.label == label]
    if min_score is not None:
        signals = [signal for signal in signals if signal.final_score >= min_score]
    signals.sort(key=lambda signal: (signal.label == "exclude", -signal.final_score, signal.ticker))
    return SignalListResponse(disclaimer=DISCLAIMER_KO, signals=signals)


def get_latest_signal(ticker: str) -> SignalResponse | None:
    security = _find_security(ticker)
    if security is None:
        return None
    return _signal_for_security(security)


def get_signal_history(ticker: str, limit: int = 10) -> list[SignalResponse] | None:
    security = _find_security(ticker)
    if security is None:
        return None
    bars = collector.get_daily_prices(security.ticker)
    index_bars = collector.get_market_index_prices(security.market)
    history: list[SignalResponse] = []
    for offset in range(limit, 0, -1):
        cutoff_bars = bars[:-offset] if offset else bars
        if len(cutoff_bars) >= 60:
            cutoff_date = cutoff_bars[-1].date
            cutoff_index = [bar for bar in index_bars if bar.date <= cutoff_date]
            history.append(calculate_signal(security, cutoff_bars, cutoff_index))
    history.append(_signal_for_security(security))
    return history[-limit:]


def _signal_for_security(security: Security) -> SignalResponse:
    bars = collector.get_daily_prices(security.ticker)
    index_bars = collector.get_market_index_prices(security.market)
    return calculate_signal(security, bars, index_bars)


def _find_security(ticker: str) -> Security | None:
    normalized = ticker.upper()
    return next((security for security in collector.list_securities() if security.ticker.upper() == normalized), None)


def _stock_response(security: Security) -> StockResponse:
    return StockResponse(
        id=security.id,
        ticker=security.ticker,
        market=security.market,
        exchange=security.exchange,
        company_name=security.company_name,
        company_name_kr=security.company_name_kr,
        country=security.country,
        currency=security.currency,
        sector=security.sector,
        industry=security.industry,
        active=security.active,
    )


def _price_response(price: DailyPrice) -> DailyPriceResponse:
    return DailyPriceResponse(
        date=str(price.date),
        open=price.open,
        high=price.high,
        low=price.low,
        close=price.close,
        adjusted_close=price.adjusted_close,
        volume=price.volume,
        trading_value=price.trading_value,
        source=price.source,
        as_of_time=price.as_of_time.isoformat(),
    )

