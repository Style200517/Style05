# SignalFlow Design System

## 0. Purpose

이 문서는 SignalFlow 주식 신호 웹 엔진의 공통 디자인 시스템이다.

기준 이미지는 다음 6개 화면이다.

1. 대시보드
2. 국내주식
3. 해외주식
4. 뉴스레이더
5. 백테스트
6. 관심종목

목표는 Codex 또는 프론트엔드 에이전트가 위 6개 기준 이미지와 거의 동일한 UX/UI 밀도, 크기, 색상, 카드 구조, 테이블 구조, 차트 구조, 여백, 타이포그래피를 구현하도록 만드는 것이다.

중요:
- 디자인은 기준 이미지와 최대한 동일해야 한다.
- 데이터는 절대 정적 예시로 컴포넌트 안에 박지 않는다.
- 모든 표, 카드, 차트, 수치, 뉴스, 종목명은 API 응답 또는 mock data provider를 통해 주입한다.
- mock data는 개발용 fallback으로만 사용하고, 컴포넌트 내부에 직접 하드코딩하지 않는다.
- 기준 이미지에 일부 투자 권유처럼 보이는 텍스트가 있더라도 실제 구현에서는 안전한 표현으로 치환한다.
- 레이아웃, 색상, 카드 밀도, 버튼 크기, 테이블 크기는 기준 이미지를 따른다.

---

## 1. Design Keywords

SignalFlow의 시각 언어는 다음 키워드를 따른다.

- Korean fintech dashboard
- Bithumb-inspired clean exchange UI
- White background
- Light gray separators
- Orange primary accent
- Dense but readable tables
- Compact cards
- Thin borders
- Minimal shadows
- Flat professional interface
- No dark mode in MVP
- No 3D
- No glassmorphism
- No gradient-heavy design
- No playful illustration
- No casino/trading-room hype style

---

## 2. Canvas and Layout Baseline

기준 디자인은 16:9 데스크톱 화면이다.

Target frame:
- Width: 1920px
- Height: 1080px
- Desktop-first
- Minimum usable width: 1440px
- Main implementation width: 100vw
- Page horizontal padding: 16px
- Top-level content gap: 14px to 16px

Generated reference images may have a proportional export size such as 1672x941. Treat them as proportional references and implement at 1920x1080 visual scale.

Base layout:
- App header: 56px to 60px
- Market ticker strip: 72px to 78px
- Page title area: 42px to 54px where used
- Filter/control area: 68px to 96px depending on page
- Main grid gap: 14px to 16px
- Card border radius: 8px to 10px
- Card border: 1px solid light gray
- Card shadow: none or extremely subtle
- Body background: near white

Recommended layout tokens:
- pagePaddingX: 16px
- sectionGap: 14px
- cardGap: 14px
- cardRadius: 8px
- headerHeight: 58px
- tickerStripHeight: 74px
- controlBarHeightCompact: 64px
- controlBarHeightDouble: 92px
- rightSidebarWidth: 456px
- mainContentGap: 16px

---

## 3. Color Tokens

Use a white and light-gray base with orange as the primary accent.

Core colors:
- Background: #FFFFFF
- Page background: #FAFAFA or #FBFBFB
- Card background: #FFFFFF
- Border primary: #E5E7EB
- Border soft: #EEF0F3
- Divider: #ECEFF3
- Text primary: #111827
- Text secondary: #4B5563
- Text muted: #8A94A6
- Disabled text: #B0B7C3
- Primary orange: #FF5A00
- Primary orange hover: #F04F00
- Primary orange soft: #FFF2E8
- Positive red used in Korean market UI: #F04438 or #FF3B30
- Negative blue: #2563EB or #2F7CF6
- Green status: #16A34A
- Green soft: #EAF8EF
- Red soft: #FFF0F0
- Blue soft: #EEF5FF
- Purple soft: #F3EEFF
- Yellow soft: #FFF7E6
- Gray chip: #F5F6F8

Important:
- In Korean stock UIs, 상승/positive values are usually red.
- 하락/negative values are blue.
- Do not use Western green/red convention for price movement unless explicitly for status chips.
- Use orange for primary actions, active tabs, score badges, active filters, and key highlights.

---

## 4. Typography

Use a clean Korean sans-serif stack.

Recommended font stack:
- Pretendard
- Inter
- Apple SD Gothic Neo
- Noto Sans KR
- system-ui
- sans-serif

Base type scale:
- Header nav: 15px to 16px, font-weight 600
- Page title: 24px to 28px, font-weight 700
- Section title: 17px to 20px, font-weight 700
- Card title: 16px to 18px, font-weight 700
- Table header: 12px to 13px, font-weight 600
- Table cell: 13px to 14px, font-weight 500
- Metric label: 12px to 13px, color muted
- Metric value large: 24px to 34px, font-weight 700
- Badge text: 12px to 13px, font-weight 600
- Button text: 13px to 14px, font-weight 600
- Chart labels: 11px to 12px

Line heights:
- Dense table cell: 1.2 to 1.35
- Regular body: 1.45
- Titles: 1.25

Do not:
- Use oversized hero typography.
- Use large marketing-style headings.
- Use inconsistent font weights between pages.
- Use decorative fonts.

---

## 5. Header

Header visual requirements:
- Height: about 58px
- Background: #FFFFFF
- Border bottom: 1px solid #E5E7EB
- Left logo area width: around 200px
- Logo icon: orange radar/signal-wave glyph
- Brand text: SignalFlow, dark text, bold italic-ish or strong sans-serif
- Nav items arranged horizontally
- Active nav item: orange text and orange bottom underline
- Inactive nav: dark gray or black
- Search field on right: 260px to 320px wide
- Notification bell with orange badge
- User area: avatar circle, name "김신호 님", dropdown chevron

Navigation order:
1. 대시보드
2. 국내주식
3. 해외주식
4. 뉴스레이더
5. 백테스트
6. 관심종목

Header behavior:
- Active tab changes per route.
- Header content is shared across all 6 pages.
- Do not recreate header differently on each page.
- The logo icon change must be applied globally.
- Header must not contain static user data in production. User name comes from session/user API or mock provider.

---

## 6. Logo

Use a fictional original SignalFlow logo.

Logo requirements:
- Orange radar / pulse / signal-wave icon
- Simple, compact, flat vector
- No exact Bithumb mark
- No cryptocurrency-specific logo
- Keep same size across all pages
- Icon and wordmark must align vertically

Approximate logo area:
- Icon size: 26px to 32px
- Wordmark font size: 22px to 24px
- Gap between icon and text: 6px to 8px
- Left padding: 24px to 28px

---

## 7. Market Ticker Strip

Used on every page.

Visual structure:
- Full-width horizontal strip
- Height: about 74px
- White background
- Bottom border: 1px solid #E5E7EB
- Each ticker item separated by vertical divider
- Compact sparkline at right side of each item
- Label top: small bold market name
- Value: large bold number
- Change: red for positive, blue for negative

Common tickers:
- Dashboard: KOSPI, KOSDAQ, S&P 500, NASDAQ, USD/KRW
- 국내주식: KOSPI, KOSDAQ, 코스피200, 코스닥150, USD/KRW
- 해외주식: S&P 500, NASDAQ, DOW, RUSSELL 2000, USD/KRW
- 뉴스레이더: KOSPI, KOSDAQ, S&P 500, NASDAQ, USD/KRW
- 백테스트: KOSPI, KOSDAQ, S&P 500, NASDAQ, USD/KRW
- 관심종목: KOSPI, KOSDAQ, S&P 500, NASDAQ, USD/KRW

Implementation:
- Use a shared `MarketTickerStrip` component.
- Data comes from market summary API or mock provider.
- Do not hardcode ticker values in the component.
- Sparklines should be SVG or chart component generated from data arrays.

---

## 8. Cards

Card style:
- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Radius: 8px to 10px
- Shadow: none or very subtle
- Padding: 16px to 18px for standard cards
- Dense table cards may use 12px to 16px
- Header area height: 42px to 48px
- Card title left
- Small action buttons right

Card title:
- Font size: 17px to 18px
- Font weight: 700
- Text color: #111827

Card subtitle:
- Font size: 12px to 13px
- Color: #8A94A6
- Placed next to title or below title depending on density

Do not:
- Use thick shadows.
- Use large rounded cards over 16px radius.
- Use gradient backgrounds.
- Use colored card backgrounds except soft chip areas.

---

## 9. Tables

Tables are central to SignalFlow.

Table visual rules:
- Dense row height: 34px to 40px
- Header row background: white or very light gray
- Header text: muted gray, 12px to 13px, font-weight 600
- Cell text: 13px to 14px
- Borders: 1px bottom line #EEF0F3
- Vertical separators only where the reference shows strong tabular density
- Numeric columns right-aligned where appropriate
- Text columns left-aligned
- Score badges centered
- Signal/status chips centered

Table types:
- Ranking table
- Screener table
- News feed table
- Backtest performance table
- Watchlist table
- Trade example table
- History table

Do not:
- Use oversized table rows.
- Use zebra striping unless very subtle.
- Use heavy borders.
- Use Material UI default table spacing if it changes density.
- Hardcode rows inside the table component.

Data rule:
- All table data must be passed through props.
- Component must support loading, empty, and error states.
- Development mock data must live in `src/mocks` or API mock handlers, not in component files.

---

## 10. Badges and Chips

Badge radius:
- 5px to 6px for small status chips
- 6px to 8px for score badges

Score badge:
- Border: 1px solid primary orange
- Background: #FFF7F0 or #FFFFFF
- Text: primary orange
- Font size: 13px
- Width: 32px to 42px depending on number
- Height: 24px to 26px

Risk badges:
- 낮음: green border/text, soft green background
- 보통: orange border/text, soft orange background
- 높음: red border/text, soft red background

Signal badges:
- 강한 관찰: blue border/text or orange emphasis depending context
- 관찰: blue soft
- 주의: orange/red soft
- 제외: gray or red soft

News badges:
- 호재: green
- 악재: red
- 공시: blue
- 수급: purple
- 실적: orange/yellow
- 매크로: gray/blue
- 가격: orange

Do not use:
- 매수
- 매도
- 수익 보장
- 급등 확정
- 무조건 상승

If any generated reference image contains "매수", the implementation should preserve the badge shape and location but replace the text with "강한 관찰" or "관찰".

---

## 11. Buttons

Primary button:
- Background: primary orange
- Text: white
- Height: 34px to 38px
- Radius: 6px
- Padding X: 14px to 18px
- Font: 13px to 14px, weight 600

Secondary button:
- Background: white
- Border: 1px solid #E5E7EB
- Text: #374151
- Same height as primary

Icon button:
- Square 32px to 36px
- Border: 1px solid #E5E7EB
- Radius: 6px

Filter pills:
- Height: 30px to 34px
- Active: orange background, white text
- Inactive: white background, gray border, dark text

Do not:
- Use large CTA buttons.
- Use gradient buttons.
- Use rounded pill buttons larger than the reference.

---

## 12. Filter Bars

Filter bars appear on 국내주식, 해외주식, 뉴스레이더, 백테스트, 관심종목.

Visual rules:
- White card-like container
- Border: 1px solid #E5E7EB
- Radius: 8px
- Padding: 12px to 16px
- Gap between controls: 10px to 14px
- Controls height: 34px to 38px
- Label and control alignment must match reference density

Dropdown:
- Height: 34px to 38px
- Border: 1px solid #E5E7EB
- Radius: 6px
- Font size: 13px
- Right chevron
- Fixed widths where possible to match screenshot rhythm

Do not:
- Use native select default styling.
- Let controls wrap unpredictably on 1920px.
- Expand filter bar height unless required by the page spec.

---

## 13. Charts

Charts are compact and dashboard-like.

Chart types:
- Sparkline
- Multi-line chart
- Candlestick chart
- Bar chart
- Drawdown area chart
- Score breakdown horizontal bars

Visual rules:
- No heavy chart backgrounds
- Light grid lines
- Small axis labels
- Orange is primary series
- Gray is benchmark
- Blue is negative or secondary market series
- Green can be strategy score or positive trend sparklines
- Red/orange for positive Korean market deltas
- Tooltips may be implemented but must not disturb layout

Chart component rules:
- Charts receive series data through props.
- No static chart arrays inside chart components.
- Empty state should show subtle "데이터 없음".
- Loading state should preserve card height to avoid layout shift.

---

## 14. Page Grid

Common screen structure:

Header:
- Shared across all pages

Market ticker strip:
- Shared across all pages

Content:
- Page-specific

Common grid variants:

A. Dashboard variant:
- Top content has three zones:
  - Left ranking card
  - Center featured analysis card
  - Right sidebar cards
- Bottom has wide chart cards and sector card

B. Screener variant:
- Main grid: left/main table and right sidebar
- Bottom: left sector map and center market flow chart

C. News variant:
- Main grid: left/main news feed and right sidebar
- Bottom: issue map and news flow chart

D. Backtest variant:
- Mixed analytics grid
- Large performance chart left
- KPI summary center
- Strategy/conditions sidebar right
- Lower charts and tables

E. Watchlist variant:
- Large watchlist table left
- Summary/alerts/groups sidebar right
- Performance chart and signal history lower area
- Priority cards bottom

---

## 15. Icons

Icon style:
- Thin outline
- 16px to 20px
- Stroke width around 1.5px
- No filled heavy icons except logo
- Use lucide-react or equivalent

Allowed icons:
- Search
- Bell
- User
- Settings
- ChevronDown
- Download
- Sliders
- Calendar
- Play
- RefreshCw
- Plus
- Grid
- List
- Star
- AlertTriangle

Logo:
- Custom SVG radar/signal-wave icon

Do not:
- Mix icon libraries with different stroke weights.
- Use emoji as UI icons.
- Use crypto-specific icons.

---

## 16. Motion

MVP motion should be minimal.

Allowed:
- Button hover color shift
- Active tab underline transition
- Table row hover subtle background
- Tooltip fade
- Dropdown open/close

Avoid:
- Large animations
- Animated background
- Animated counters that distract
- Flashing trading alerts

---

## 17. Empty, Loading, and Error States

Every dynamic component must support:

Loading:
- Skeleton rows for tables
- Skeleton cards for KPI boxes
- Preserve final layout height

Empty:
- Minimal text such as "표시할 데이터가 없습니다"
- Secondary hint if applicable

Error:
- "데이터를 불러오지 못했습니다"
- Retry action if useful
- Never show broken raw JSON to users

Do not:
- Replace dynamic components with static filler data on failure.
- Render fake production values.
- Hide API failures silently.

---

## 18. Data Integrity Rule

The design may show realistic values, but implementation must not hardcode them.

Forbidden:
- Hardcoded stock rows inside React page files
- Hardcoded news feed rows inside components
- Hardcoded market ticker values in header
- Hardcoded chart series in UI components
- Static screenshots used as UI background
- Static generated image embedded as page design

Allowed:
- Mock data in separate `src/mocks` or `fixtures` directory
- MSW handlers for local development
- Storybook fixtures
- API-driven props
- Server-rendered data from backend
- Loading skeletons

Required:
- All page components should consume typed data models.
- Mock provider and live API provider must share the same types.
- UI must remain visually identical whether using mock data or live data.

---

## 19. Visual QA Checklist

Before marking UI complete:

- Header height matches reference.
- Active navigation underline matches reference.
- Logo uses the radar-style orange icon.
- Market ticker strip height and density match reference.
- Page title spacing matches reference.
- Filter controls align horizontally and match height.
- Table row height matches reference.
- Card border radius and border color match reference.
- Right sidebar width remains consistent across relevant pages.
- Orange color is consistent across tabs, score badges, buttons, and highlights.
- Positive values in Korean market convention are red/orange.
- Negative values are blue.
- No static sample data is embedded in components.
- No "매수/매도" wording is used for live signals.
- Loading states preserve layout height.
- Empty states are implemented.
- Visual diff against reference image should be checked at 1920x1080.