# `/goal` Prompt: SignalFlow UI

```text
Goal: Implement the SignalFlow frontend from docs/design and the 6 reference images.

Rules:
- Before work, read /workspaces/Style05/AGENTS.md and keep its TODO updated.
- Work only under project/global-stock-signal-engine/internal.
- Read every md in /workspaces/Style05/docs/design fully.
- Use images only as visual references:
  01_dashboard.png, 02_domestic_stocks.png, 03_overseas_stocks.png,
  04_news_radar.png, 05_backtest.png, 06_watchlist.png.
- Do not import, embed, trace, or use reference images as UI/background.
- Match 1920x1080 visual density: header height, ticker strip, card sizes,
  sidebar width, filter height, dense tables, badge sizes, chart heights.

Routes:
- /dashboard
- /domestic
- /overseas
- /news-radar
- /backtest
- /watchlist

Shared shell:
- Build one AppShell with AppHeader, SignalFlowLogo, TopNavigation,
  GlobalSearch, NotificationButton, UserMenu, MarketTickerStrip, PageContainer.
- Header about 58px, ticker strip about 74px, page padding 16px.
- Active nav: orange text + orange underline.
- Logo: original orange radar/signal-wave SVG, not Bithumb or external asset.
- Right sidebar width about 456px where used.

Visual style:
- Korean fintech/exchange-like desktop dashboard.
- White/near-white background, #FF5A00 orange accent, thin #E5E7EB borders.
- Flat 8px cards, minimal shadow, no gradients, no dark mode.
- Dense tables: 34-40px rows, 12-13px headers, 13-14px cells.
- Positive market movement uses Korean convention red/orange; negative uses blue.

Data rules:
- Do not hardcode rows, news, chart series, ticker values, KPI values, or
  watchlist items inside pages or reusable components.
- All display data comes from typed API provider or mock provider.
- Mock data only in frontend/mocks, fixtures, tests, or Storybook.
- Components receive typed props only.
- Frontend must not calculate final scores or mutate signal data.

Safety copy:
- Product is a stock signal research tool, not investment advice.
- Live signal labels only: 강한 관찰, 관찰, 중립, 주의, 제외.
- Do not use live-signal copy: 매수, 매도, 수익 보장, 급등 확정,
  무조건 상승, AI 추천주, 대박 종목.
- Backtest historical labels may use 익절, 손절, 보유, 청산 only in backtest.
- Always show risk, confidence, sample/validation context, and disclaimer:
  본 서비스는 투자 판단 보조용 리서치 도구이며 투자 손실 가능성이 존재합니다.

Page targets:
- Dashboard: left ranking card, center featured analysis, right news/market/watchlist sidebar, bottom backtest and sector cards.
- Domestic: two-row filter, 12-row screener table, right market/sector/issues/watchlist sidebar, bottom sector map and market flow.
- Overseas: same as domestic with global data.
- News Radar: issue filters, 12-row news table, summary/clusters/alerts/sidebar, issue map and news flow.
- Backtest: controls, cumulative chart, KPI summary, strategy/conditions/history sidebar, returns/risk/trades.
- Watchlist: controls, watchlist table, summary/alerts/groups sidebar, performance, signal history, priority cards.

Implementation order:
1. Inspect current frontend and replace temporary scaffold only as needed.
2. Add design tokens/global CSS.
3. Add typed models and mock provider.
4. Add shared shell/header/ticker.
5. Add base Card/Button/Badge/DataTable/FilterToolbar/Sparkline/chart components.
6. Implement all six routes.
7. Add loading/empty/error states preserving card height.
8. Check banned copy and image-use violations.
9. Run TypeScript/lint/build if dependencies are available; document limits.

Done when all six routes render with shared shell, provider-driven data,
reference-like density, safe copy, no component-local production data, and no
reference image used as an asset.
```

