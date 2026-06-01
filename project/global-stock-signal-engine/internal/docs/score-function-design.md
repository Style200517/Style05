# Final Score Function Design

MVP 1 code path:

```txt
MockMarketDataCollector
  -> signal_service
  -> scoring_service.calculate_signal
  -> SignalResponse
```

Core functions:

- `calculate_price_signal_score`
- `calculate_market_regime_score`
- `calculate_liquidity_score`
- `calculate_relative_strength_score`
- `calculate_risk_penalty`
- `calculate_confidence`
- `assign_label`
- `calculate_probability`

Hard exclusions are applied before normal scoring. Final labels and confidence
are deterministic and inspectable.

Probability is an MVP display estimate derived from final score and confidence;
it is never shown alone and must remain paired with reasons, risk flags, sample
size, and validation context.

