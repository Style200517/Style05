# Data Sources

MVP 1 uses generated sample data through `MockMarketDataCollector`.

Future provider boundaries:

- KR prices and indices: KRX Open API or broker API.
- KR disclosures: OpenDART.
- KR news: licensed news/search API with deduplication.
- US prices: Alpha Vantage, Polygon.io, Tiingo, IEX Cloud, or similar.
- US disclosures: SEC EDGAR.
- Global news and macro: Finnhub, GDELT, Nasdaq Data Link, or licensed provider.

Before production integration, confirm official API specs, call limits, storage
rights, redistribution rights, and commercial use terms.

