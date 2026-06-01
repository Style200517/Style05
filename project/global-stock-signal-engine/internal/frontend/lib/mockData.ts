import { DISCLAIMER } from "./constants";
import type { SignalListResponse, StockDetail } from "./types";

export const fallbackSignals: SignalListResponse = {
  disclaimer: DISCLAIMER,
  signals: [
    {
      ticker: "005930",
      company_name: "Samsung Electronics",
      market: "KR",
      exchange: "KOSPI",
      signal_date: "2026-05-08",
      horizon_days: 5,
      final_score: 74.6,
      p_up: 0.61,
      expected_return: 0.0148,
      downside_risk: 0.036,
      confidence: "B",
      risk_level: "low",
      label: "watch",
      score_breakdown: {
        price_signal_score: 78,
        news_event_score: 50,
        disclosure_score: 50,
        market_regime_score: 70,
        fundamental_score: 50,
        liquidity_score: 88,
        relative_strength_score: 67,
        risk_penalty: 4
      },
      bullish_reasons: ["종가가 20일 평균 위에 있습니다.", "최근 5거래일 가격 흐름이 양호합니다."],
      bearish_reasons: ["운영 백테스트가 아직 완료되지 않았습니다."],
      risk_flags: [],
      data_quality_flags: [],
      source_refs: ["fallback:sample"],
      sample_size: 100,
      backtest: {
        status: "not_run_mvp1",
        sample_size: 100,
        summary: "샘플 fallback 데이터입니다. 백엔드 실행 시 계산 결과로 대체됩니다."
      },
      created_at: "2026-05-08T00:00:00Z"
    },
    {
      ticker: "SMLC",
      company_name: "Sample Micro Cap",
      market: "US",
      exchange: "AMEX",
      signal_date: "2026-05-08",
      horizon_days: 5,
      final_score: 0,
      p_up: 0.05,
      expected_return: 0,
      downside_risk: 0,
      confidence: "D",
      risk_level: "high",
      label: "exclude",
      score_breakdown: {
        price_signal_score: 0,
        news_event_score: 50,
        disclosure_score: 50,
        market_regime_score: 0,
        fundamental_score: 50,
        liquidity_score: 0,
        relative_strength_score: 0,
        risk_penalty: 35
      },
      bullish_reasons: [],
      bearish_reasons: ["데이터 또는 유동성 기준을 충족하지 못해 제외로 분류됩니다."],
      risk_flags: ["거래대금 기준 미달"],
      data_quality_flags: [],
      source_refs: ["fallback:sample"],
      sample_size: 100,
      backtest: {
        status: "not_run_mvp1",
        sample_size: 100,
        summary: "제외 후보는 MVP 1 백테스트 대상에서 제외합니다."
      },
      created_at: "2026-05-08T00:00:00Z"
    }
  ]
};

export const fallbackStockDetail: StockDetail = {
  stock: {
    id: 1,
    ticker: "005930",
    market: "KR",
    exchange: "KOSPI",
    company_name: "Samsung Electronics",
    company_name_kr: "삼성전자",
    country: "KR",
    currency: "KRW",
    sector: "Technology",
    industry: "Semiconductors",
    active: true
  },
  prices: Array.from({ length: 30 }).map((_, index) => {
    const close = 76000 + index * 160 + Math.sin(index / 3) * 900;
    return {
      date: `2026-04-${String(index + 1).padStart(2, "0")}`,
      open: close - 300,
      high: close + 700,
      low: close - 900,
      close,
      adjusted_close: close,
      volume: 12000000 + index * 50000,
      trading_value: close * (12000000 + index * 50000),
      source: "fallback",
      as_of_time: "2026-05-08T15:45:00Z"
    };
  })
};

