# Data Collector Interface

MVP 1 uses `MockMarketDataCollector`.

Minimum collector contract:

```python
class MarketDataCollector:
    def list_securities(self) -> list[Security]: ...
    def get_daily_prices(self, ticker: str) -> list[DailyPrice]: ...
    def get_market_index_prices(self, market: str) -> list[DailyPrice]: ...
```

Future collectors should return provider-shaped raw records first, then pass
through normalizers:

- ticker and exchange normalizer
- timezone normalizer
- corporate action normalizer
- news deduplicator
- entity linker
- disclosure event mapper

Each record must carry `source` and an observable timestamp such as
`as_of_time`, `published_at`, `crawled_at`, or `accepted_at`.

