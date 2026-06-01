export type SignalLabel = "strong_watch" | "watch" | "neutral" | "risk" | "exclude";
export type Confidence = "A" | "B" | "C" | "D";
export type RiskLevel = "low" | "medium" | "high";

export interface ScoreBreakdown {
  price_signal_score: number;
  news_event_score: number;
  disclosure_score: number;
  market_regime_score: number;
  fundamental_score: number;
  liquidity_score: number;
  relative_strength_score: number;
  risk_penalty: number;
}

export interface BacktestContext {
  status: string;
  sample_size: number;
  summary: string;
}

export interface Signal {
  ticker: string;
  company_name: string;
  market: "KR" | "US" | "GLOBAL";
  exchange: string;
  signal_date: string;
  horizon_days: number;
  final_score: number;
  p_up: number;
  expected_return: number;
  downside_risk: number;
  confidence: Confidence;
  risk_level: RiskLevel;
  label: SignalLabel;
  score_breakdown: ScoreBreakdown;
  bullish_reasons: string[];
  bearish_reasons: string[];
  risk_flags: string[];
  data_quality_flags: string[];
  source_refs: string[];
  sample_size: number;
  backtest: BacktestContext;
  created_at: string;
}

export interface SignalListResponse {
  disclaimer: string;
  signals: Signal[];
}

export interface DailyPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number;
  volume: number;
  trading_value: number;
  source: string;
  as_of_time: string;
}

export interface Stock {
  id: number;
  ticker: string;
  market: "KR" | "US";
  exchange: string;
  company_name: string;
  company_name_kr: string | null;
  country: string;
  currency: string;
  sector: string;
  industry: string;
  active: boolean;
}

export interface StockDetail {
  stock: Stock;
  prices: DailyPrice[];
}

