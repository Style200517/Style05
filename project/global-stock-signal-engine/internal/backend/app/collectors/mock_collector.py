from app.sample_data import DailyPrice, SECURITIES, Security, get_index_prices, get_prices_by_ticker


class MockMarketDataCollector:
    """Provider-shaped sample collector used by MVP 1 and tests."""

    def list_securities(self) -> list[Security]:
        return list(SECURITIES)

    def get_daily_prices(self, ticker: str) -> list[DailyPrice]:
        return get_prices_by_ticker(ticker)

    def get_market_index_prices(self, market: str) -> list[DailyPrice]:
        if market not in {"KR", "US"}:
            return []
        return get_index_prices(market)  # type: ignore[arg-type]

