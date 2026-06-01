# Input Output Contracts

All market data must preserve:

- `source`
- provider timestamp when available
- normalized timestamp
- `as_of_time` or crawled/accepted time
- created time

All signal outputs must include:

- score breakdown
- confidence
- label
- reasons
- risk flags
- data quality flags
- source references
- sample size
- validation/backtest context

Probabilities must never be shown without the surrounding evidence and risk
context.

