# Global Stock Signal Engine

Web-based research signal engine for Korean and US stocks. This MVP is not an
investment advisory product. It combines sample price, volume, liquidity, market
regime, risk, and future-ready event interfaces to show explainable research
labels:

- strong_watch: 강한 관찰 후보
- watch: 관찰 후보
- neutral: 중립
- risk: 주의
- exclude: 제외

Required user-facing notice:

> 본 서비스는 투자 판단 보조용 리서치 도구이며 투자 손실 가능성이 존재합니다.

## MVP 1 Scope

- FastAPI backend with deterministic rule-based scoring.
- Sample dataset with 12 securities: 6 KR and 6 US.
- At least 90 generated daily bars per security.
- Mock collectors so the app runs without external API keys.
- Dashboard and stock detail pages in Next.js.
- No automatic trading, account linkage, or final trade directive.

## Local Development

Backend:

```bash
cd project/global-stock-signal-engine/internal/backend
python3 -m venv .venv
. .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

Frontend:

```bash
cd project/global-stock-signal-engine/internal/frontend
npm install
npm run dev
```

Validation without installing web dependencies:

```bash
cd project/global-stock-signal-engine/internal
python3 -m unittest discover backend/tests
```

