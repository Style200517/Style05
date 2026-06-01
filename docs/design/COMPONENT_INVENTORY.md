# SignalFlow Component Inventory

## 0. Purpose

이 문서는 6개 기준 화면을 구현하기 위한 컴포넌트 목록과 역할을 정의한다.

원칙:
- 컴포넌트는 재사용 가능해야 한다.
- 컴포넌트 내부에 정적 예시 데이터를 넣지 않는다.
- 모든 데이터는 props로 받는다.
- mock data는 별도 mock provider에 둔다.
- 컴포넌트는 디자인 시스템의 크기, 여백, 색상, 밀도를 유지한다.

---

## 1. Layout Components

### `AppShell`

Purpose:
- 전체 앱 레이아웃 wrapper
- Header, MarketTickerStrip, page content를 감싼다.

Props:
- `children`
- `activeNav`
- `tickerItems`
- `user`
- `notificationCount`

Rules:
- Header와 ticker strip을 모든 페이지에 동일하게 렌더링한다.
- Page content에 consistent padding을 적용한다.

---

### `AppHeader`

Purpose:
- 상단 공통 헤더

Contains:
- `SignalFlowLogo`
- `TopNavigation`
- `GlobalSearch`
- `NotificationButton`
- `UserMenu`

Props:
- `activeNav`
- `user`
- `notificationCount`
- `onSearch`

Rules:
- route에 따라 active nav만 달라진다.
- 헤더 높이는 모든 페이지에서 동일하다.
- 로고는 radar-like orange SignalFlow icon을 사용한다.

---

### `SignalFlowLogo`

Purpose:
- SignalFlow 로고 표시

Props:
- `size`
- `variant`

Rules:
- orange radar/signal-wave icon
- no Bithumb logo
- no imported external brand asset

---

### `MarketTickerStrip`

Purpose:
- 상단 시장 지표 스트립

Props:
- `items: MarketTickerItem[]`

MarketTickerItem:
- `id`
- `label`
- `value`
- `change`
- `changePercent`
- `direction`
- `sparkline`

Rules:
- 데이터는 props로만 받는다.
- positive는 red/orange, negative는 blue.
- sparkline은 data array 기반으로 렌더링한다.

---

### `PageContainer`

Purpose:
- 페이지 본문 공통 padding and spacing

Props:
- `children`
- `className`

Rules:
- 1920x1080 기준 여백을 유지한다.
- max-width를 지나치게 제한하지 않는다.

---

## 2. Base UI Components

### `Card`

Purpose:
- 공통 카드 container

Props:
- `title`
- `subtitle`
- `actions`
- `children`
- `size`
- `className`

Rules:
- white background
- light gray border
- radius 8px
- no heavy shadow

---

### `SectionHeader`

Purpose:
- 카드 또는 페이지 섹션 제목

Props:
- `title`
- `subtitle`
- `actions`

---

### `Button`

Variants:
- `primary`
- `secondary`
- `ghost`
- `icon`
- `dangerSoft`

Rules:
- primary is orange
- height matches control height
- avoid oversized CTA

---

### `FilterPill`

Props:
- `label`
- `active`
- `count?`
- `onClick`

Variants:
- active orange
- inactive white/gray

---

### `SelectControl`

Props:
- `label`
- `value`
- `options`
- `onChange`
- `width`

Rules:
- custom controlled select
- avoid native inconsistent browser styling if possible

---

### `FilterToolbar`

Purpose:
- screener/news/watchlist/backtest filter areas

Props:
- `pillGroups`
- `controls`
- `primaryAction`
- `secondaryAction`

Rules:
- layout should preserve reference spacing
- controls must be controlled
- options can be dynamic

---

### `DataTable`

Purpose:
- dense reusable table

Props:
- `columns`
- `rows`
- `rowKey`
- `loading`
- `emptyText`
- `error`
- `onRowClick?`

Column:
- `id`
- `label`
- `align`
- `width?`
- `render`

Rules:
- row height 36px to 40px
- no hardcoded row data
- supports skeleton rows
- supports empty state

---

### `KpiCard`

Props:
- `label`
- `value`
- `delta?`
- `tone`
- `size`

Tones:
- positive
- negative
- neutral
- warning
- primary

---

## 3. Badge Components

### `ScoreBadge`

Purpose:
- 상승 가능성 점수, 영향도 점수 표시

Props:
- `score`
- `size`

Rules:
- orange border/text
- compact rectangular badge

---

### `RiskBadge`

Props:
- `riskLevel`

Values:
- 낮음
- 보통
- 높음

---

### `SignalBadge`

Props:
- `signal`

Values:
- 강한 관찰
- 관찰
- 중립
- 주의
- 제외

Rules:
- never render 매수/매도 for live signal
- if raw API sends unsafe label, normalize or warn

---

### `NewsTypeBadge`

Props:
- `type`

Values:
- 호재
- 악재
- 공시
- 수급
- 실적
- 매크로
- 가격
- 이슈

---

### `StatusBadge`

Props:
- `status`
- `context`

Values:
- 주목
- 관찰
- 경계
- 확인
- 활성
- 가격근접
- 이슈발생
- OFF
- 완료
- 실행중
- 익절
- 손절

Rules:
- Backtest result statuses can use 익절/손절.
- Live signal statuses cannot use buy/sell language.

---

## 4. Chart Components

### `Sparkline`

Props:
- `data`
- `tone`
- `width`
- `height`

Use:
- market ticker strip
- sector strength
- issue maps

---

### `LineChartCard`

Props:
- `title`
- `subtitle`
- `series`
- `legend`
- `tabs?`
- `summary?`
- `height`

Use:
- backtest cumulative performance
- market flow
- news flow
- watchlist performance trend

---

### `BarChartCard`

Props:
- `title`
- `series`
- `categories`
- `legend`
- `height`

Use:
- annual performance comparison

---

### `DrawdownChart`

Props:
- `series`
- `metrics`

Use:
- backtest risk analysis

---

### `CandlestickPanel`

Props:
- `symbol`
- `candles`
- `movingAverages`
- `tabs`
- `selectedTab`

Use:
- dashboard featured analysis

---

### `ScoreBreakdownBars`

Props:
- `items`

Item:
- `label`
- `value`
- `max`
- `percent`

Use:
- dashboard featured analysis
- backtest strategy composition

---

## 5. Dashboard Components

### `TodayWatchCandidatesCard`

Props:
- `rows`
- `loading`
- `error`

Displays:
- 오늘의 관찰 후보
- ranking table

---

### `FeaturedAnalysisCard`

Props:
- `candidate`
- `chartData`
- `scoreBreakdown`
- `bullishReasons`
- `riskFlags`

Displays:
- 오늘의 집중 분석
- price
- chart
- score
- reasons
- risks

---

### `NewsRadarMiniCard`

Props:
- `items`

Displays:
- 뉴스 레이더 compact list

---

### `MarketSummaryCard`

Props:
- `summary`

Displays:
- 상승 종목
- 하락 종목
- 보합 종목
- 거래대금
- 외국인/기관 등 market-specific metrics

---

### `BacktestPerformanceCard`

Props:
- `equityCurve`
- `metrics`

Displays:
- 누적 수익률
- benchmark comparison
- metrics

---

### `SectorStrengthCard`

Props:
- `rows`

Displays:
- 섹터 강도

---

## 6. Screener Components

### `StockScreenerPageLayout`

Props:
- `marketType`
- `filterOptions`
- `rows`
- `sidebarData`
- `sectorMap`
- `marketFlow`

Use:
- 국내주식
- 해외주식

---

### `ScreenerFilterBar`

Props:
- `themePills`
- `filters`
- `onApply`
- `onReset`

---

### `StockScreenerTable`

Props:
- `rows`
- `columnsConfig`
- `loading`
- `error`

Row model:
- `rank`
- `name`
- `ticker`
- `market`
- `price`
- `changePercent`
- `tradingValue`
- `marketCap`
- `score`
- `expectedReturn`
- `riskLevel`
- `confidence`
- `signal`

---

### `SectorMapCard`

Props:
- `rows`

---

### `MarketFlowCard`

Props:
- `series`
- `summary`

---

## 7. News Radar Components

### `NewsRadarFilterBar`

Props:
- `issueTypePills`
- `filters`
- `onApply`
- `onReset`

---

### `NewsRadarFeedTable`

Props:
- `rows`
- `loading`
- `error`

Row model:
- `type`
- `title`
- `relatedAsset`
- `market`
- `impactScore`
- `source`
- `publishedAt`
- `status`

---

### `NewsSummaryCard`

Props:
- `summary`

Displays:
- 호재 뉴스 수
- 악재 뉴스 수
- 공시/보고서
- 평균 영향도
- 주요 시장 반응
- 실시간 알림

---

### `IssueClusterCard`

Props:
- `clusters`

---

### `RealtimeAlertsCard`

Props:
- `alerts`

---

### `InterestNewsCard`

Props:
- `items`

---

### `IssueMapCard`

Props:
- `issues`

---

### `NewsFlowCard`

Props:
- `series`
- `summary`

---

## 8. Backtest Components

### `BacktestControlBar`

Props:
- `config`
- `options`
- `onRun`
- `onReset`

Controls:
- 전략
- 시장
- 벤치마크
- 기간
- 보유기간
- 리밸런싱
- 수수료

---

### `CumulativePerformanceCard`

Props:
- `series`
- `activeTab`
- `onTabChange`

Tabs:
- 누적 수익률
- 초과 수익
- 드로다운

---

### `BacktestSummaryCard`

Props:
- `summary`

Displays:
- 누적 수익률
- 벤치마크 대비
- 승률
- 최대 낙폭
- 샤프지수
- 거래 횟수

---

### `StrategyCompositionCard`

Props:
- `weights`

---

### `BacktestConditionsCard`

Props:
- `conditions`

---

### `BacktestRunHistoryCard`

Props:
- `runs`

---

### `MonthlyReturnsTable`

Props:
- `rows`

---

### `RiskAnalysisCard`

Props:
- `drawdownSeries`
- `metrics`

---

### `AnnualPerformanceComparisonCard`

Props:
- `series`

---

### `RecentTradeExamplesTable`

Props:
- `rows`

Row model:
- `name`
- `market`
- `entryDate`
- `exitDate`
- `entryPrice`
- `exitPrice`
- `returnPercent`
- `holdingDays`
- `result`

Rules:
- Historical result can be 익절/손절.
- Data comes from backtest provider.

---

## 9. Watchlist Components

### `WatchlistControlBar`

Props:
- `filters`
- `onApply`
- `onReset`
- `onAdd`
- `onManageGroups`

---

### `WatchlistTable`

Props:
- `rows`
- `loading`
- `error`

Row model:
- `rank`
- `name`
- `ticker`
- `market`
- `price`
- `changePercent`
- `score`
- `expectedReturn`
- `riskLevel`
- `signal`
- `alertStatus`
- `memo`

---

### `WatchlistSummaryCard`

Props:
- `summary`

Displays:
- 전체 종목 수
- 강한 관찰 수
- 주의 종목 수
- 실시간 알림
- 평균 상승 가능성 점수
- 평균 기대수익률
- 오늘 평균 등락률

---

### `AlertCenterCard`

Props:
- `alerts`

---

### `WatchlistGroupsCard`

Props:
- `groups`

---

### `WatchlistPerformanceCard`

Props:
- `series`
- `summary`

---

### `SignalChangeHistoryCard`

Props:
- `changes`

Row model:
- `name`
- `previousSignal`
- `currentSignal`
- `changedAt`
- `reason`

---

### `PriorityWatchCards`

Props:
- `items`

Displays:
- 우선 확인 종목 compact cards

---

## 10. Data Provider Inventory

Required provider functions:

Dashboard:
- `getDashboardData()`

Market:
- `getMarketTickers(pageType)`
- `getMarketSummary(marketType)`

Domestic:
- `getDomesticScreener(params)`
- `getDomesticSectorStrength()`
- `getDomesticMarketFlow()`

Overseas:
- `getOverseasScreener(params)`
- `getGlobalSectorStrength()`
- `getGlobalMarketFlow()`

News:
- `getNewsRadarFeed(params)`
- `getNewsSummary(params)`
- `getIssueClusters(params)`
- `getRealtimeAlerts(params)`
- `getNewsFlow(params)`

Backtest:
- `getBacktestOptions()`
- `runBacktest(config)`
- `getBacktestSummary(id)`
- `getBacktestEquityCurve(id)`
- `getBacktestMonthlyReturns(id)`
- `getBacktestRisk(id)`
- `getBacktestTrades(id)`
- `getBacktestRunHistory()`

Watchlist:
- `getWatchlist(params)`
- `getWatchlistSummary()`
- `getWatchlistAlerts()`
- `getWatchlistGroups()`
- `getWatchlistPerformance()`
- `getSignalChangeHistory()`
- `getPriorityWatchItems()`

---

## 11. Storybook and Mock Rule

Storybook stories are allowed and recommended.

Mock data may exist in:
- `src/mocks`
- `src/fixtures`
- Storybook files
- test fixtures

Mock data must not exist in:
- reusable components
- route page components except as provider import
- chart components
- table components

---

## 12. Component Done Criteria

A component is complete only if:
- It accepts typed props.
- It has no hardcoded production data.
- It matches design system spacing.
- It supports loading if data-driven.
- It supports empty state if list/table/chart.
- It uses approved copy.
- It uses badge variants consistently.
- It can be reused on at least one more page if applicable.