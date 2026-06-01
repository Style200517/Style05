# Backtest Rules

Backtests are deferred beyond MVP 1, but the contracts are fixed:

- Features must use only data observable before `signal_time`.
- News requires `published_at` and `crawled_at` before `signal_time`.
- Disclosures require `accepted_at` and `crawled_at` before `signal_time`.
- Close-based signals cannot assume same-day close execution.
- Default entry is next trading day open.
- Default exit is `horizon_days` later close.
- Fees, tax, slippage, FX, minimum fees, and liquidity limits must be modeled.
- Halted, delisted, managed, and symbol-changed securities must be handled.
- Train, validation, and test windows must preserve time order.

