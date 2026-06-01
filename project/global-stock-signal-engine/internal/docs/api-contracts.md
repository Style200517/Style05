# API Contracts

## Health

`GET /api/health`

Returns service status, version, and mode.

## Stocks

`GET /api/stocks`

Returns normalized security metadata.

`GET /api/stocks/{ticker}`

Returns one security.

## Signals

`GET /api/signals/today?market=KR|US&label=watch&min_score=65`

Returns ranked signal cards.

`GET /api/signals/{ticker}`

Returns the latest signal for a ticker.

`GET /api/signals/{ticker}/history`

Returns historical sample signals for a ticker.

