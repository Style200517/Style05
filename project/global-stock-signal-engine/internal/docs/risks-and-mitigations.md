# Risks And Mitigations

## Legal And Product Risk

Risk: users may interpret labels as individualized advice.

Mitigation: safe labels, required disclaimer, no trade directives, no guarantees,
and risk flags visible near every probability.

## Data Risk

Risk: provider terms, delayed data, missing corporate actions, duplicate news,
and survivorship bias can corrupt signals.

Mitigation: provider boundary, source refs, observable timestamps, hashes,
normalization, and explicit data quality flags.

## Backtest Risk

Risk: future-data leakage and unrealistic execution can overstate performance.

Mitigation: `as_of_time`, next-day entry, cost modeling, liquidity filters, and
leakage checks.

## Model Risk

Risk: rules or future ML models overfit recent market regimes.

Mitigation: rule transparency in MVP 1, walk-forward validation, calibration,
confidence buckets, and paper tracking before raising trust.

## UI Risk

Risk: dense tables can hide uncertainty or overemphasize one score.

Mitigation: pair score with evidence, risks, confidence, sample size, and audit
context. Redesign waits for `design.md`.

