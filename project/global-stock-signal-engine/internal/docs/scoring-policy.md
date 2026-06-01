# Scoring Policy

MVP 1 common score:

```txt
base_score =
  0.30 * price_signal_score
+ 0.20 * market_regime_score
+ 0.20 * news_event_score
+ 0.10 * fundamental_score
+ 0.10 * liquidity_score
+ 0.10 * relative_strength_score

final_score = clamp(base_score - risk_penalty, 0, 100)
```

Neutral defaults:

- `news_event_score = 50`
- `fundamental_score = 50`

Hard exclusions:

- KR 20-day average trading value below KRW 1,000,000,000.
- US 20-day average trading value below USD 10,000,000.
- fewer than 60 valid daily bars.
- missing latest close or volume.

Labels:

- `strong_watch`: final score >= 80, confidence A/B, risk not excessive.
- `watch`: final score >= 65.
- `neutral`: final score >= 50.
- `risk`: elevated risk or score below 50 with risk flags.
- `exclude`: hard filter or confidence D from data/liquidity failure.

