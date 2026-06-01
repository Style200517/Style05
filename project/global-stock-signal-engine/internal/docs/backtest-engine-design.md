# Backtest Engine Design

Planned modules:

- `engine.py`: run config and orchestration
- `portfolio.py`: holdings and cash ledger
- `execution.py`: next-day open entry, horizon exit, fees, tax, slippage
- `metrics.py`: return, drawdown, precision@K, calibration, exposure
- `walk_forward.py`: time-ordered train/validation/test windows
- `leakage_checks.py`: observable-time assertions
- `reports.py`: persisted run summaries

MVP 1 includes only `leakage_checks.assert_observable_before_signal` so future
backtests have a hard guardrail from the start.

