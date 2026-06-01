# Architecture

```txt
Mock/Data Collectors
  -> Normalizers
  -> Feature Generation
  -> Quant Signal Engine
  -> Scoring Engine
  -> API Routers
  -> Web Dashboard
```

MVP 1 runs from deterministic in-process sample data. The module boundaries match
future production ingestion:

- Collectors return raw provider-like records.
- Normalizers produce canonical securities, bars, events, and observable times.
- Feature modules generate point-in-time features.
- Services calculate signals and assemble explainable cards.
- Routers only validate request/response boundaries.
- Frontend renders API contracts and fallback sample data.

