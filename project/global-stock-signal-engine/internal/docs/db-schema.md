# DB Schema

MVP 1 can run in memory from sample data. The production schema should persist
the following tables when PostgreSQL is introduced.

## securities

- `id`
- `ticker`
- `market`
- `exchange`
- `company_name`
- `company_name_kr`
- `aliases`
- `country`
- `currency`
- `sector`
- `industry`
- `active`
- `listed_at`
- `delisted_at`
- `created_at`
- `updated_at`

## daily_prices

- `id`
- `security_id`
- `date`
- `open`
- `high`
- `low`
- `close`
- `adjusted_close`
- `volume`
- `trading_value`
- `source`
- `as_of_time`
- `created_at`

## market_indices

- `id`
- `ticker`
- `name`
- `country`
- `date`
- `open`
- `high`
- `low`
- `close`
- `volume`
- `as_of_time`

## disclosures and disclosure_events

`disclosures` stores provider records with `accepted_at`, `crawled_at`, URL,
hash, and summary. `disclosure_events` stores structured impact fields,
confidence, evidence, and risk flags.

## news_items, news_entities, news_events

`news_items` stores source metadata, URL hash, title, summary, timestamps, and
minimal text needed by terms of use. `news_entities` maps items to securities.
`news_events` stores event classification, novelty, priced-in risk, duplicate
risk, evidence, risk flags, and user summary.

## features_daily

Stores point-in-time feature JSON by `security_id`, `date`, and
`feature_set_version`. Every feature set must be reproducible from data observed
before signal time.

## predictions and signal_cards

`predictions` stores deterministic or model outputs, component scores, label,
confidence, reasons, risk flags, and generated time. `signal_cards` stores the
presentation snapshot so later UI changes do not rewrite historical outputs.

## validation and audit

- `backtest_runs`
- `backtest_trades`
- `prediction_outcomes`
- `model_runs`
- `audit_logs`

These tables preserve model versions, feature versions, validation windows,
trade assumptions, realized outcomes, and audit payloads.

