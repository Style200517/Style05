# UI Implementation Prompt for Codex

## 0. Role

You are a senior frontend engineer implementing the SignalFlow Korean fintech dashboard UI.

Your goal is to implement the UI so it visually matches the 6 provided reference images as closely as possible.

Pages:
1. Dashboard
2. Domestic Stocks
3. Overseas Stocks
4. News Radar
5. Backtest
6. Watchlist

You must follow:
- `docs/design/SIGNALFLOW_DESIGN_SYSTEM.md`
- `docs/design/DASHBOARD_SCREEN_SPEC.md`
- `docs/design/UI_NEGATIVE_PROMPT.md`
- `docs/design/COPYWRITING_RULES.md`
- `docs/design/COMPONENT_INVENTORY.md`

---

## 1. Critical Requirement

Do not hardcode static sample data inside page components or reusable UI components.

All displayed data must come from:
- API response
- typed server loader
- typed mock provider
- MSW handler
- fixture passed through props
- Storybook fixture

Never embed fixed rows directly in the component body.

Allowed:
- UI labels such as column names, button labels, tab labels
- Empty state copy
- Loading skeleton structure
- Typed mock objects in `src/mocks` only

Forbidden:
- hardcoded stock rows in `page.tsx`
- hardcoded news list in component files
- hardcoded market ticker values in `AppHeader` or `MarketTickerStrip`
- hardcoded chart arrays inside chart components
- static screenshot as UI background

---

## 2. Reference Image Handling

If reference images are available, place them under:

- `docs/design/reference/01_dashboard.png`
- `docs/design/reference/02_domestic_stocks.png`
- `docs/design/reference/03_overseas_stocks.png`
- `docs/design/reference/04_news_radar.png`
- `docs/design/reference/05_backtest.png`
- `docs/design/reference/06_watchlist.png`

Use these only for visual reference and screenshot diff.

Do not:
- import these images into production UI
- use them as background
- trace over them with absolute-positioned static UI
- reproduce them as a static image

Implement the UI using real components.

---

## 3. Recommended Stack

Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui only if component density can be fully controlled
- lucide-react for icons
- Recharts, lightweight-charts, or SVG for charts
- TanStack Table if useful
- React Query or server fetch wrappers for data
- Zod for API response validation if available

Global requirements:
- Use CSS variables or Tailwind tokens matching design system.
- Components must be reusable across the 6 pages.
- Avoid one-off styling that breaks visual consistency.

---

## 4. Required Routes

Implement or align these pages:

- `/dashboard`
- `/domestic`
- `/overseas`
- `/news-radar`
- `/backtest`
- `/watchlist`

If the app already uses different route names, map them consistently and document the mapping.

---

## 5. Shared Layout

Implement a shared layout shell:

Components:
- `AppShell`
- `AppHeader`
- `SignalFlowLogo`
- `TopNavigation`
- `GlobalSearch`
- `NotificationButton`
- `UserMenu`
- `MarketTickerStrip`
- `PageContainer`

The shell must preserve:
- Same header height on all pages
- Same ticker strip height on all pages
- Same horizontal padding on all pages
- Same active nav underline style
- Same top-right controls

Do not duplicate header code per page.

---

## 6. Data Architecture

Create typed interfaces for all major data structures.

Required model groups:
- Market ticker item
- Signal row
- Stock screener row
- News radar row
- Backtest summary
- Backtest chart series
- Monthly return row
- Risk metric row
- Watchlist row
- Alert item
- Sector strength row
- Group summary row
- KPI card

Data source pattern:
- `src/services/*` or `src/data/*` fetches data
- `src/mocks/*` provides fallback data for local dev
- UI components receive typed props
- Pages compose fetch results and pass props down

Example architecture:
- `src/types/market.ts`
- `src/types/signals.ts`
- `src/types/news.ts`
- `src/types/backtest.ts`
- `src/types/watchlist.ts`
- `src/services/api.ts`
- `src/mocks/marketMock.ts`
- `src/mocks/signalMock.ts`

The implementation must allow replacing mocks with live API without changing UI components.

---

## 7. Visual Fidelity Implementation Order

Follow this order:

1. Build shared header and ticker strip.
2. Implement design tokens and base layout.
3. Implement cards, buttons, badges, tables, filter bars.
4. Implement dashboard page skeleton.
5. Implement domestic page.
6. Implement overseas page.
7. Implement news radar page.
8. Implement backtest page.
9. Implement watchlist page.
10. Add charts and sparklines.
11. Add loading and empty states.
12. Bind dynamic mock provider data.
13. Compare with reference images.
14. Refine spacing, font sizes, row heights, and card widths.

Do not start with backend complexity.
Do not implement live trading.
Do not implement business logic inside UI components.

---

## 8. Layout Constants

Use these layout constants unless project constraints require slight adjustment:

- `HEADER_HEIGHT = 58`
- `TICKER_STRIP_HEIGHT = 74`
- `PAGE_PADDING_X = 16`
- `SECTION_GAP = 14`
- `CARD_GAP = 16`
- `CARD_RADIUS = 8`
- `RIGHT_SIDEBAR_WIDTH = 456`
- `CONTROL_HEIGHT = 36`
- `TABLE_ROW_HEIGHT = 36`
- `TABLE_HEADER_HEIGHT = 38`

Tailwind style should reflect these constants.

---

## 9. Page Implementation Notes

### Dashboard

Use the three-zone top layout:
- Left ranking table
- Center featured analysis
- Right sidebar

Bottom:
- Backtest performance
- Sector strength

Data must be loaded from a dashboard data provider.

### Domestic Stocks

Use screener page layout:
- Filter bar
- Main screener table
- Right sidebar
- Bottom sector map and market flow

Use Korean market-specific ticker strip.

### Overseas Stocks

Same structure as Domestic Stocks.
Change content labels and data model fields as needed.
Keep layout identical to Domestic page.

### News Radar

Use news-specific table/list.
Keep same screen density.
Main card title: 뉴스레이더 피드.
Right sidebar: 뉴스 요약, 이슈 클러스터, 실시간 알림, 내 관심 뉴스.
Bottom: 이슈 맵, 뉴스 흐름.

### Backtest

Use analytics grid:
- Filter controls
- Cumulative performance
- Backtest summary KPI
- Strategy composition sidebar
- Monthly returns
- Risk analysis
- Annual comparison
- Recent trades

KPI and chart data must come from data provider.

### Watchlist

Use watchlist management layout:
- Filter controls
- Large watchlist table
- Summary sidebar
- Alerts
- Groups
- Performance trend
- Signal history
- Priority cards

All rows and cards must be dynamic.

---

## 10. Component Constraints

Tables:
- Must support column alignment.
- Must support dense row height.
- Must support loading skeleton.
- Must support empty state.
- Must not contain fixed rows.

Charts:
- Must accept data arrays.
- Must preserve fixed card height.
- Must use design system colors.
- Must not generate random data inside component.

Badges:
- Must use controlled variants.
- Must normalize unsafe signal copy.
- Must maintain same visual size across pages.

Filters:
- Must be controlled components.
- Must use data-driven options.
- Active state must match reference style.

---

## 11. Copy Safety

Live signal labels must use:
- 강한 관찰
- 관찰
- 주의
- 제외
- 중립

Do not use:
- 매수
- 매도
- 수익 보장
- 급등 확정
- AI 추천주
- 무조건 상승

Backtest trade result labels may use:
- 익절
- 손절
- 보유
because those are historical result states, not live recommendations.

---

## 12. QA Requirements

Before completing:

- Run TypeScript checks.
- Run lint if available.
- Ensure no hardcoded table rows in components.
- Ensure no static chart arrays in components.
- Verify all pages share the same header and ticker strip.
- Verify active nav is correct.
- Verify reference image visual comparison.
- Verify Korean copy matches rules.
- Verify loading and empty states.
- Verify responsive behavior does not break desktop layout.

---

## 13. Deliverable Format

When implementing, report:

- Files created
- Files updated
- Components added
- Data providers added
- Routes implemented
- Tests or checks run
- Known differences from reference images
- Any remaining visual-diff tasks

Do not claim pixel-perfect completion unless screenshot comparison has been performed.