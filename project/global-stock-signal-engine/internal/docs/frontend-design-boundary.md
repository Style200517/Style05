# Frontend Design Boundary

Frontend implementation is paused until the user provides `design.md` and design
examples.

Existing files under `frontend/` are an MVP scaffold only:

- API client types
- fallback sample data
- dashboard route
- stock detail route
- reusable signal/risk/score components

When `design.md` arrives:

- Preserve safe financial wording.
- Rework layout, typography, spacing, and components to match the design.
- Keep scoring/business logic out of React components.
- Preserve dashboard filters: market, label, minimum score.
- Preserve required disclaimer.

