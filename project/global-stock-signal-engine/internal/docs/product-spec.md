# Product Spec

## Pass 1: Interpretation And Risk Check

Global Stock Signal Engine is a research website that helps users inspect Korean
and US stock candidates by combining observable data, deterministic scoring,
risk flags, confidence, and validation context. The product must not frame
outputs as trading instructions or guaranteed outcomes.

MVP 1 is intentionally narrow:

- Sample data only.
- Deterministic rule-based scoring only.
- Dashboard and stock detail pages.
- Mock collector interfaces for future KRX, DART, SEC, and news providers.
- News, disclosures, fundamentals, ML, and backtests are designed but not treated
  as production signals in MVP 1.

Main risks:

- Legal/compliance: wording may be mistaken for individualized advice.
- Data: real provider terms, latency, survivorship, holidays, currency, and
  corporate actions are not solved by sample data.
- Backtest: future leakage can appear if signal time and observable time are not
  stored.
- Model: early rules can overfit if tuned against hand-picked examples.
- UI: probabilities can mislead if separated from evidence, risk, confidence, and
  sample size.

Defaults:

- Horizon: 5 trading days.
- MVP 1 label target: market-relative observation candidate, not a recommendation.
- Common weights: price 0.30, market regime 0.20, news event 0.20, fundamental
  0.10, liquidity 0.10, relative strength 0.10, minus risk penalty.
- News and fundamentals default to neutral 50 unless sample events are present.

## Pass 2: Implementable Design

MVP 1 is implemented as:

- `backend/app/sample_data.py`: deterministic sample universe and daily bars.
- `backend/app/services/scoring_service.py`: scoring, confidence, labels, reasons.
- `backend/app/services/signal_service.py`: API-facing signal assembly.
- `backend/app/collectors/mock_collector.py`: data provider boundary.
- `frontend/app/dashboard/page.tsx`: candidate table with filters.
- `frontend/app/stocks/[ticker]/page.tsx`: signal detail page.

The implementation keeps scoring outside routers and UI components. Future
collectors can replace mock data without changing scoring contracts.

