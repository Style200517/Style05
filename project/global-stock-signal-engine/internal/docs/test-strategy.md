# Test Strategy

Implemented with `unittest` so the MVP can validate core logic before installing
project dependencies.

Current tests:

- sample dataset contains 6 KR and 6 US securities
- every sample security has at least 90 daily bars
- final score stays in 0 to 100
- low liquidity securities are excluded
- label assignment produces valid categories
- frontend source does not contain prohibited wording

API smoke tests are included but skipped unless FastAPI dependencies are
installed and `RUN_API_TESTS=1` is set.

Future tests:

- no future price data
- no future news data
- no future disclosure data
- next-day entry rule
- fee, tax, and slippage application
- delisted and halted security handling
- TOP K metrics
- calibration metrics

