# Module Boundaries

- `collectors/`: provider adapters, including mock collectors.
- `normalizers/`: ticker, alias, timezone, and entity mapping.
- `features/`: pure feature calculations.
- `services/`: scoring, signals, news, disclosure, backtest orchestration.
- `schemas/`: Pydantic request and response models.
- `routers/`: FastAPI endpoints only.
- `llm/`: structured prompts and JSON schemas for future event classification.
- `backtest/`: leakage-safe simulation contracts.
- `frontend/lib/`: API clients, types, constants, formatting.
- `frontend/components/`: presentational and interactive UI components.

Business logic must not be embedded in React components or API route handlers.

