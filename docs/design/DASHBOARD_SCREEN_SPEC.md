# SignalFlow Page Screen Specs

## 0. Scope

이 문서는 SignalFlow 6개 기준 화면의 페이지별 레이아웃 명세다.

Pages:
1. `/dashboard` 대시보드
2. `/domestic` 또는 `/stocks/kr` 국내주식
3. `/overseas` 또는 `/stocks/global` 해외주식
4. `/news-radar` 뉴스레이더
5. `/backtest` 백테스트
6. `/watchlist` 관심종목

목표:
- 6개 기준 이미지와 같은 UX/UI 크기, 밀도, 구조, 여백을 유지한다.
- 페이지 제목과 내용만 각 메뉴 목적에 맞게 변형한다.
- 모든 데이터는 API 또는 mock provider에서 들어온다.
- 정적 예시 데이터를 컴포넌트 내부에 박지 않는다.

---

## 1. Global Screen Shell

모든 페이지는 동일한 Shell을 사용한다.

Structure:
- `AppHeader`
- `MarketTickerStrip`
- `PageContent`

Global dimensions:
- Canvas target: 1920x1080
- Page horizontal padding: 16px
- Content width: 100%
- Header height: 58px
- Market strip height: 74px
- Section vertical gap: 14px to 16px
- Card radius: 8px
- Main gap: 16px

Shell rules:
- Header는 페이지마다 재작성하지 않는다.
- Market ticker strip은 페이지별 ticker set만 바뀐다.
- Active navigation state만 route에 따라 변경한다.
- 모든 페이지의 우측 검색창, 알림, 사용자 영역은 동일 크기와 위치를 유지한다.

---

## 2. Shared Header Spec

Header:
- Height: 58px
- Left padding: 24px
- Right padding: 24px
- Logo area width: 190px to 220px
- Nav gap: 38px to 44px
- Active tab underline: 2px orange line at bottom
- Search input width: 280px to 320px
- Search input height: 34px
- Notification icon size: 20px
- Badge size: 16px to 18px
- User text: 14px to 15px

Active tab per route:
- `/dashboard`: 대시보드
- `/domestic`: 국내주식
- `/overseas`: 해외주식
- `/news-radar`: 뉴스레이더
- `/backtest`: 백테스트
- `/watchlist`: 관심종목

---

## 3. Shared Market Ticker Strip

Ticker strip:
- Height: 74px
- Display: horizontal flex
- Each ticker item width: roughly 300px to 360px depending page
- Vertical separators between items
- Sparkline width: 90px to 130px
- Sparkline height: 28px to 34px
- Label font: 12px, bold
- Value font: 20px to 22px, bold
- Change font: 12px to 13px

Shared ticker data model:
- symbol
- label
- value
- change
- changePercent
- direction
- sparklineSeries

No static values inside `MarketTickerStrip`.

---

## 4. `/dashboard` — 대시보드

Purpose:
- 전체 국내/해외 신호 요약
- 오늘의 관찰 후보
- 집중 분석
- 뉴스 레이더
- 시장 요약
- 관심종목
- 백테스트 성과
- 섹터 강도

Active nav:
- 대시보드

Layout:
- Header
- MarketTickerStrip
- Main dashboard grid

Top main grid:
- Left card: `오늘의 관찰 후보`
- Center card: `오늘의 집중 분석`
- Right sidebar:
  - `뉴스 레이더`
  - `시장 요약`
  - `내 관심종목`

Approximate layout:
- Left ranking card width: 620px to 640px
- Center analysis card width: 760px to 790px
- Right sidebar width: 460px to 480px
- Gap: 14px to 16px
- Top row height: around 560px

Left card `오늘의 관찰 후보`:
- Dense ranking table
- Columns:
  - 순위
  - 종목명
  - 티커
  - 상승 가능성 점수
  - 기대수익률
  - 위험도
  - 신뢰도
- 10 rows visible
- Score badge orange outline
- Risk badge green/orange/red
- Must not hardcode stock rows

Center card `오늘의 집중 분석`:
- Featured stock summary
- Large price display
- 상승 가능성 점수 KPI
- Tabs: 일봉, 주봉, 월봉, 3개월, 1년, 3년
- Candlestick/line chart
- Score breakdown horizontal bars
- Bottom two boxes:
  - 판단 근거
  - 리스크

Right sidebar:
- `뉴스 레이더` list with 호재/악재/공시 badges
- `시장 요약` stat grid
- `내 관심종목` compact table
- If reference text contains "매수", replace implementation signal text with "강한 관찰" or "관찰" while preserving badge location and visual size.

Bottom grid:
- Left wide card: `백테스트 성과`
- Center/right card: `섹터 강도`
- Backtest card includes orange vs gray line chart and right KPI stack
- Sector card includes table rows with mini sparklines

Dynamic data sources:
- `/api/signals/today`
- `/api/signals/featured`
- `/api/news/recent`
- `/api/market/summary`
- `/api/watchlist`
- `/api/backtests/latest`
- `/api/sectors/strength`

---

## 5. `/domestic` — 국내주식

Purpose:
- 국내 종목 스크리너
- 시장/테마 필터
- 국내 시장 요약
- 섹터 강도
- 실시간 국내 이슈
- 관심 국내종목
- 국내 업종 맵
- 국내 시장 흐름

Active nav:
- 국내주식

Top ticker set:
- KOSPI
- KOSDAQ
- 코스피200
- 코스닥150
- USD/KRW

Filter card:
- Height: around 94px
- First row:
  - 시장/테마
  - 전체 active
  - KOSPI
  - KOSDAQ
  - 대형주
  - 중소형주
  - 반도체
  - 2차전지
  - 바이오
  - 자동차
  - + 테마 추가
- Second row:
  - 정렬 기준
  - 시가총액
  - 거래대금
  - 위험도
  - 보유기간
  - 검색/필터 적용
  - 초기화

Main grid:
- Left/main width: remaining space
- Right sidebar width: 456px
- Gap: 16px

Main card:
- Title: 국내주식 스크리너
- Subtitle: 조건에 맞는 국내 종목을 빠르게 탐색
- Toolbar:
  - 컬럼 설정
  - 내보내기
- Table columns:
  - 순위
  - 종목명
  - 티커
  - 시장
  - 현재가
  - 등락률
  - 거래대금
  - 시가총액
  - 상승 가능성 점수
  - 기대수익률
  - 위험도
  - 신뢰도
  - 신호
- Visible rows: 12
- Row height: 36px to 40px

Right sidebar cards:
1. 국내 시장 요약
2. 섹터 강도 TOP 5
3. 실시간 이슈
4. 내 관심 국내종목

Bottom:
- Left card: 국내 업종 맵
- Center card: 국내 시장 흐름

Dynamic data sources:
- `/api/stocks/domestic`
- `/api/market/domestic/summary`
- `/api/sectors/domestic/strength`
- `/api/news/domestic/recent`
- `/api/watchlist?market=KR`
- `/api/market/domestic/flow`

---

## 6. `/overseas` — 해외주식

Purpose:
- 해외/미국 주식 스크리너
- 글로벌 지수 요약
- 해외 섹터 강도
- 글로벌 실시간 이슈
- 관심 해외종목
- 해외 업종 맵
- 해외 시장 흐름

Active nav:
- 해외주식

Top ticker set:
- S&P 500
- NASDAQ
- DOW
- RUSSELL 2000
- USD/KRW

Filter card:
- Same size and rhythm as 국내주식
- First row:
  - 시장/테마
  - 전체 active
  - 미국
  - 나스닥
  - 뉴욕증권거래소
  - 대형기술주
  - 반도체
  - AI
  - 전기차
  - 헬스케어
  - 금융
  - + 테마 추가
- Second row:
  - 정렬 기준
  - 시가총액
  - 거래대금
  - 위험도
  - 보유기간
  - 검색/필터 적용
  - 초기화

Main card:
- Title: 해외주식 스크리너
- Subtitle: 조건에 맞는 해외 종목을 빠르게 검색
- Table columns:
  - 순위
  - 종목명
  - 티커
  - 시장
  - 현재가
  - 등락률
  - 거래대금
  - 시가총액
  - 상승 가능성 점수
  - 기대수익률
  - 위험도
  - 신뢰도
  - 신호
- Visible rows: 12

Right sidebar cards:
1. 해외 시장 요약
2. 섹터 강도 TOP 5
3. 실시간 이슈
4. 내 관심 해외종목

Bottom:
- Left card: 해외 업종 맵
- Center card: 해외 시장 흐름

Dynamic data sources:
- `/api/stocks/overseas`
- `/api/market/global/summary`
- `/api/sectors/global/strength`
- `/api/news/global/recent`
- `/api/watchlist?market=GLOBAL`
- `/api/market/global/flow`

---

## 7. `/news-radar` — 뉴스레이더

Purpose:
- 실시간 뉴스/공시/수급/매크로 이슈 탐색
- 영향도 기반 뉴스 피드
- 이슈 클러스터
- 실시간 알림
- 관심 뉴스
- 뉴스 흐름

Active nav:
- 뉴스레이더

Important visual distinction:
- Stock screener table is replaced by news feed table.
- Same design density, but row content is news/event oriented.
- Logo uses radar/signal-wave icon globally.

Top ticker set:
- KOSPI
- KOSDAQ
- S&P 500
- NASDAQ
- USD/KRW

Filter card:
- First row label: 이슈 유형
- Pills:
  - 전체 active
  - 호재
  - 악재
  - 공시
  - 수급
  - 실적
  - 매크로
  - AI
  - 반도체
  - 바이오
  - 자동차
  - + 키워드 추가
- Second row:
  - 정렬 기준 = 최신순
  - 시장 = 전체
  - 영향도 = 전체
  - 관련 종목 = 전체
  - 출처 = 전체
  - 시간대 = 24시간
  - 검색/필터 적용
  - 초기화

Main card:
- Title: 뉴스레이더 피드
- Subtitle: 시장에 영향을 주는 실시간 뉴스와 이벤트를 빠르게 탐색
- Toolbar:
  - 뷰 설정
  - 내보내기
- Table columns:
  - 유형
  - 제목
  - 관련 종목
  - 시장
  - 영향도
  - 출처
  - 게시 시각
  - 상태
- Visible rows: 12
- News titles must be dynamic from API or mock provider.
- Impact score uses orange score badge.
- Category uses colored badge.

Right sidebar cards:
1. 뉴스 요약
2. 이슈 클러스터 TOP 5
3. 실시간 알림
4. 내 관심 뉴스

Bottom:
- Left card: 이슈 맵
- Center card: 뉴스 흐름

Dynamic data sources:
- `/api/news/radar`
- `/api/news/summary`
- `/api/news/clusters`
- `/api/alerts/news`
- `/api/watchlist/news`
- `/api/news/flow`

---

## 8. `/backtest` — 백테스트

Purpose:
- 전략 성과와 리스크를 과거 데이터 기준으로 검증
- 누적 성과
- KPI 요약
- 전략 구성
- 백테스트 조건
- 최근 실행 내역
- 기간별 수익률
- 리스크 분석
- 연도별 성과 비교
- 최근 체결 예시

Active nav:
- 백테스트

Top ticker set:
- KOSPI
- KOSDAQ
- S&P 500
- NASDAQ
- USD/KRW

Page title:
- 백테스트 분석
- Subtitle: 전략 성과와 리스크를 과거 데이터 기준으로 검증

Filter card:
- Single row, same compact style
- Controls:
  - 전략
  - 시장
  - 벤치마크
  - 기간
  - 보유기간
  - 리밸런싱
  - 수수료
  - 백테스트 실행
  - 초기화

Upper grid:
- Left large card: 누적 성과
- Center card: 백테스트 요약
- Right sidebar card: 전략 구성

Main upper-left `누적 성과`:
- Tabs:
  - 누적 수익률 active
  - 초과 수익
  - 드로다운
- Orange strategy line
- Gray benchmark line
- Footer disclaimer:
  - 과거 성과는 미래 수익을 보장하지 않으며, 수수료·슬리피지 반영 기준입니다.

Center `백테스트 요약`:
- KPI grid:
  - 누적 수익률
  - 벤치마크 대비
  - 승률
  - 최대 낙폭
  - 샤프지수
  - 거래 횟수

Right sidebar:
1. 전략 구성
2. 백테스트 조건
3. 최근 실행 내역

Middle:
- Left card: 기간별 수익률
- Center card: 리스크 분석

Bottom:
- Left card: 연도별 성과 비교
- Center/wide card: 최근 체결 예시

Dynamic data sources:
- `/api/backtests/config-options`
- `/api/backtests/run`
- `/api/backtests/latest`
- `/api/backtests/{id}/summary`
- `/api/backtests/{id}/equity-curve`
- `/api/backtests/{id}/monthly-returns`
- `/api/backtests/{id}/risk`
- `/api/backtests/{id}/trades`

No static results:
- KPI values
- chart lines
- monthly returns
- recent run history
- trade examples
must come from data provider.

---

## 9. `/watchlist` — 관심종목

Purpose:
- 관심 종목의 신호, 변동률, 알림 상태를 한눈에 관리
- 관심종목 목록
- 관심종목 요약
- 알림 센터
- 그룹 관리
- 성과 추이
- 신호 변화 히스토리
- 우선 확인 종목

Active nav:
- 관심종목

Top ticker set:
- KOSPI
- KOSDAQ
- S&P 500
- NASDAQ
- USD/KRW

Page title:
- 관심종목 관리
- Subtitle: 관심 종목의 신호, 변동률, 알림 상태를 한눈에 관리

Control row:
- 관심 그룹
- 시장
- 신호 상태
- 위험도
- 알림 상태
- 정렬
- 검색/필터 적용
- 초기화
- + 관심종목 추가
- 그룹 관리

Main card:
- Title: 내 관심종목 목록
- Toolbar:
  - 컬럼 설정
  - 내보내기
- Table columns:
  - 순위
  - 종목명
  - 티커
  - 시장
  - 현재가
  - 등락률
  - 상승 가능성 점수
  - 기대수익률
  - 위험도
  - 신호
  - 알림
  - 메모
- Visible rows: 10
- Mixed domestic/global tickers are allowed, but supplied by data source.

Right sidebar:
1. 관심종목 요약
2. 알림 센터
3. 내 그룹

Bottom:
- Left card: 관심종목 성과 추이
- Center card: 신호 변화 히스토리
- Full lower row: 우선 확인 종목

Dynamic data sources:
- `/api/watchlist`
- `/api/watchlist/summary`
- `/api/watchlist/alerts`
- `/api/watchlist/groups`
- `/api/watchlist/performance`
- `/api/watchlist/signal-history`
- `/api/watchlist/priority`

---

## 10. Responsive Rule

MVP target is desktop.

Desktop:
- Preserve 1920x1080 layout.
- Right sidebar remains visible.
- Tables remain dense.

Tablet/mobile:
- Can be deferred unless explicitly required.
- If implemented, stack cards vertically.
- Do not compromise desktop fidelity for mobile.

---

## 11. Visual Fidelity Rule

For each page:
- Implement layout first.
- Then implement exact spacing.
- Then implement typography.
- Then implement data binding.
- Then compare with reference screenshot.
- Use screenshot diff at 1920x1080.
- Accept only minor text/data differences caused by dynamic data.
- Do not change card proportions for convenience.

Required visual match priority:
1. Header and ticker strip
2. Page title and filter row
3. Main grid proportions
4. Card boundaries and gaps
5. Table density
6. Badge sizes and colors
7. Chart dimensions
8. Right sidebar stacking
9. Typography weight and size
10. Dynamic values