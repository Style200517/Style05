# Feature Generation Design

MVP 1 generated features:

- moving-average position: 5, 20, 60 days
- recent returns: 5 and 20 days
- 20-day high and low proximity
- volume ratio versus 20-day average
- 20-day average trading value
- 20-day volatility
- market index trend
- 5/20-day relative strength versus market

Future feature modules:

- `price_features.py`
- `volume_features.py`
- `relative_strength_features.py`
- `liquidity_features.py`
- `fundamental_features.py`
- `market_regime_features.py`
- `news_event_features.py`
- `disclosure_features.py`
- `risk_features.py`

Feature generation rule:

`generate_*_features(security_id, signal_time)` must query only data whose
observable timestamp is less than or equal to `signal_time`.

