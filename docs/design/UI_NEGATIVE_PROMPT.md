# SignalFlow UI Negative Prompt

## 0. Purpose

이 문서는 SignalFlow UI 개발 시 절대 하지 말아야 할 것을 정의한다.

목표:
- 기준 이미지와의 디자인 일치도 유지
- 정적 예시 데이터 하드코딩 방지
- 금융 서비스 오해 방지
- UI 밀도와 크기 붕괴 방지
- 컴포넌트 재사용성 유지

---

## 1. Do Not Change the Design Language

Do not:
- 다른 디자인 시스템으로 바꾸지 않는다.
- Material UI 기본 스타일처럼 보이게 만들지 않는다.
- Ant Design 기본 스타일처럼 보이게 만들지 않는다.
- shadcn/ui 기본 여백을 그대로 써서 기준 이미지보다 커지게 만들지 않는다.
- 다크 모드로 바꾸지 않는다.
- 그래디언트와 그림자를 강하게 넣지 않는다.
- 카드 radius를 과하게 키우지 않는다.
- 대시보드 밀도를 낮추지 않는다.
- 테이블 row height를 크게 만들지 않는다.
- 헤더 높이를 임의로 키우지 않는다.
- 마켓 티커 스트립을 제거하지 않는다.
- 오른쪽 사이드바 폭을 임의로 크게 또는 작게 바꾸지 않는다.
- 모바일 우선 레이아웃으로 바꾸지 않는다.
- 화면을 카드 몇 개만 있는 단순 랜딩 페이지처럼 만들지 않는다.

---

## 2. Do Not Hardcode Static Example Data

Forbidden:
- page component 안에 종목 배열을 직접 작성
- table component 안에 10개 row 직접 작성
- news component 안에 뉴스 제목 직접 작성
- chart component 안에 고정 series 배열 작성
- ticker strip 안에 KOSPI 값 직접 작성
- backtest KPI 값을 컴포넌트 내부에 직접 작성
- watchlist row를 컴포넌트 내부에 직접 작성
- Math.random으로 임시 차트 생성
- 현재 날짜 기반으로 가짜 수익률 생성
- 실제 데이터처럼 보이는 fake production values를 API 실패 시 표시

Allowed only in separate mock layer:
- `src/mocks/*.ts`
- `src/fixtures/*.ts`
- Storybook stories
- MSW handlers
- test fixtures

Rule:
- UI components render props.
- Pages get data from service/provider.
- Mock provider and live API provider share identical type shape.

---

## 3. Do Not Use Unsafe Financial Copy

Do not use live signal labels such as:
- 매수
- 매도
- 강력 매수
- 추천 매수
- 수익 보장
- 급등 확정
- 무조건 상승
- AI 추천주
- 오늘 살 종목
- 대박 종목
- 확정 수익
- 손실 없음

Use instead:
- 강한 관찰
- 관찰
- 주의
- 제외
- 중립
- 상승 가능성 점수
- 통계적 후보
- 리스크 플래그
- 신뢰도
- 과거 유사 패턴
- 백테스트 기준

Exception:
- Backtest historical result labels may use 익절, 손절, 보유, 청산.
- These must be clearly inside historical/backtest context.

---

## 4. Do Not Make It Crypto-Specific

Although the visual style is inspired by a Korean exchange-like UI, this product is a stock signal research dashboard.

Do not:
- Use crypto coin names as primary entities.
- Use coin icons.
- Use crypto wallet language.
- Use 입출금, 지갑, 거래소 주문, 코인 매수 labels.
- Use crypto exchange trading screen terminology unless it also applies to stocks.
- Use Bithumb logo or name.
- Copy official Bithumb brand assets.

Use:
- 국내주식
- 해외주식
- 종목
- 티커
- 시장
- 상승 가능성 점수
- 신호
- 관심종목
- 백테스트
- 뉴스레이더

---

## 5. Do Not Break the Shared Shell

Do not:
- Create a different header for each page.
- Change logo size per page.
- Change search bar width per page.
- Change active tab indicator style per page.
- Remove user area.
- Move notification icon.
- Change market ticker strip height per page.
- Use different card radius per page.
- Use different table density per page.

All 6 pages must feel like the same product.

---

## 6. Do Not Oversimplify the Screens

Do not replace the reference-like dashboard with:
- A simple centered table
- A landing page
- A few large metric cards
- A mobile-like stacked layout
- Generic admin dashboard layout
- Full-screen chart only
- Text-heavy report layout

SignalFlow screens must stay:
- dense
- structured
- card-based
- table-heavy
- chart-supported
- Korean fintech-like
- data-dashboard oriented

---

## 7. Do Not Abuse Absolute Positioning

Do not:
- Implement the entire screen with fixed absolute positions.
- Use a static screenshot as background.
- Create non-responsive pixel hacks that break when data changes.
- Position individual table cells manually.

Allowed:
- Use CSS grid/flex to match layout.
- Use fixed heights for chart cards where necessary.
- Use max/min widths to preserve desktop shape.

---

## 8. Do Not Ignore Data States

Do not:
- Leave blank UI during loading.
- Collapse card height during loading.
- Show fake data on error.
- Hide API error silently.
- Render broken chart when data is empty.
- Let tables jump in height when data loads.

Required:
- Loading skeletons
- Empty states
- Error states
- Stable card heights

---

## 9. Do Not Overuse Colors

Do not:
- Add many saturated colors outside badge categories.
- Use neon green or purple as primary colors.
- Use colorful gradient chart backgrounds.
- Use red/green Western market convention blindly.

Use:
- Orange primary
- Red/orange for positive Korean-style movement
- Blue for negative movement
- Green for favorable status badges
- Red for risk/악재
- Blue for 공시/확인
- Purple for 수급/가격근접
- Gray for neutral

---

## 10. Do Not Change Table Semantics

Do not:
- Merge important columns just to save space.
- Remove score, risk, confidence, or signal columns.
- Hide risk fields.
- Hide bearish/risk information.
- Turn all rows into card tiles on desktop.
- Use infinite scroll without preserving table layout.
- Use table row height larger than reference.

Tables are core to the product.

---

## 11. Do Not Let LLM or UI Decide Scores

Frontend must not:
- Calculate final investment signal from raw news.
- Randomly generate score.
- Let UI infer bullish/bearish state from text.
- Change score based on color only.
- Mutate prediction data.

Frontend displays typed data from backend/provider.

---

## 12. Do Not Skip Visual QA

Do not mark done without:
- Checking all six routes.
- Checking active nav state.
- Checking header and ticker strip consistency.
- Checking no hardcoded rows inside components.
- Checking all tables with empty/loading states.
- Checking screenshots at 1920x1080 or equivalent ratio.
- Checking Korean copy safety.
- Checking visual density against reference.

---

## 13. Do Not Use Placeholder-Only Implementation

Do not submit:
- Empty components with TODOs
- Static gray boxes instead of tables
- Static chart placeholders
- Unstyled HTML tables
- Components with fake text but no data contract
- Pages that require future implementation to be usable

Every page should be usable with mock provider data and ready for live data binding.

---

## 14. Do Not Invent Inconsistent Routes

Do not create random route names such as:
- `/stocks1`
- `/page2`
- `/new-dashboard`
- `/test-backtest`
- `/my-list-temp`

Use agreed routes:
- `/dashboard`
- `/domestic`
- `/overseas`
- `/news-radar`
- `/backtest`
- `/watchlist`

If existing app uses other routes, document mapping clearly.

---

## 15. Final Negative Rule

Do not optimize for "pretty".
Optimize for:
- reference image match
- data density
- consistency
- safety
- dynamic data binding
- reusable components
- production implementation