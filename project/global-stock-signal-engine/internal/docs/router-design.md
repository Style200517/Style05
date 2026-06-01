# FastAPI Router Design

Routers should be thin adapters over services.

Implemented in MVP 1:

- `GET /api/health`
- `GET /api/stocks`
- `GET /api/stocks/{ticker}`
- `GET /api/signals/today`
- `GET /api/signals/{ticker}`
- `GET /api/signals/{ticker}/history`

Planned:

- `GET /api/news/recent`
- `GET /api/news/events/{ticker}`
- `GET /api/disclosures/recent`
- `GET /api/disclosures/events/{ticker}`
- `GET /api/backtests`
- `GET /api/backtests/{id}`
- `POST /api/backtests/run`
- `GET /api/model/metrics`
- `GET /api/model/audit`
- `GET /api/watchlist`
- `POST /api/watchlist`
- `POST /api/watchlist/items`
- `DELETE /api/watchlist/items/{id}`

Routing rules:

- No scoring logic in route handlers.
- No provider calls directly inside route handlers.
- Every response uses Pydantic schemas.
- Errors should distinguish not found, bad filters, and upstream provider failure.

