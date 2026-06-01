# Model Audit

MVP 1 has deterministic rule scoring, not ML scoring.

Audit records should track:

- scoring version
- feature version
- signal date/time
- component scores
- reasons and risk flags
- sample size
- generated data source
- future model version and calibration metadata

Future ML releases must add model run records, calibration metrics, confidence
bucket performance, and market-regime split performance.

