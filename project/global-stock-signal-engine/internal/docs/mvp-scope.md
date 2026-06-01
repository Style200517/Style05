# MVP Scope

## MVP 1 Included

- 12 sample securities: 6 KR, 6 US.
- 90+ business-day daily price bars per security.
- Market index sample data.
- Rule-based price, volume, liquidity, relative strength, market regime, and risk
  scoring.
- Hard exclusions for insufficient data, missing latest price/volume, and low
  liquidity.
- FastAPI endpoints:
  - `GET /api/health`
  - `GET /api/stocks`
  - `GET /api/stocks/{ticker}`
  - `GET /api/signals/today`
  - `GET /api/signals/{ticker}`
  - `GET /api/signals/{ticker}/history`
- Next.js pages:
  - `/dashboard`
  - `/stocks/[ticker]`
- Required disclaimer and safe labels.

## Deferred

- Real KRX, DART, SEC, broker, and news API integrations.
- LLM-based event classification.
- ML prediction models.
- Full backtest execution UI.
- Authentication, alerts, paid access, and account integration.
- Any order placement or automatic trading.

