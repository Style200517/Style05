export type NavKey = "dashboard" | "domestic" | "overseas" | "news-radar" | "backtest" | "watchlist";
export type MarketScope = "KR" | "US" | "GLOBAL";
export type Direction = "up" | "down" | "flat";
export type SignalLabel = "strong_watch" | "watch" | "neutral" | "risk" | "exclude";
export type RiskLevel = "low" | "medium" | "high";
export type ConfidenceGrade = "A" | "B" | "C" | "D";
export type NewsType = "호재" | "악재" | "공시" | "수급" | "실적" | "매크로" | "가격" | "이슈" | "확인" | "관찰";
export type StatusTone = "primary" | "positive" | "negative" | "warning" | "neutral" | "info";

export interface UserProfile {
  name: string;
  avatarLabel: string;
}

export interface MarketTickerItem {
  id: string;
  label: string;
  value: string;
  change: string;
  changePercent: string;
  direction: Direction;
  sparkline: number[];
}

export interface KpiMetric {
  label: string;
  value: string;
  delta?: string;
  tone?: StatusTone;
}

export interface SignalRow {
  rank: number;
  name: string;
  ticker: string;
  market: string;
  price: string;
  changePercent: string;
  tradingValue: string;
  marketCap: string;
  score: number;
  expectedReturn: string;
  riskLevel: RiskLevel;
  confidence: string;
  signal: SignalLabel;
}

export interface CandidateRow {
  rank: number;
  name: string;
  ticker: string;
  score: number;
  expectedReturn: string;
  riskLevel: RiskLevel;
  confidence: string;
}

export interface CandlePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ScoreBreakdownItem {
  label: string;
  value: number;
  max: number;
}

export interface FeaturedAnalysis {
  name: string;
  ticker: string;
  price: string;
  change: string;
  changePercent: string;
  score: number;
  confidence: string;
  candles: CandlePoint[];
  scoreBreakdown: ScoreBreakdownItem[];
  reasons: string[];
  risks: string[];
}

export interface NewsItem {
  id: string;
  type: NewsType;
  title: string;
  relatedAsset: string;
  market: string;
  impactScore: number;
  source: string;
  publishedAt: string;
  status: "주목" | "관찰" | "경계" | "확인" | "중립";
}

export interface SidebarListItem {
  label: string;
  value: string;
  subValue?: string;
  tone?: StatusTone;
}

export interface SectorStrengthRow {
  sector: string;
  score: number;
  changePercent: string;
  sparkline: number[];
  direction: Direction;
}

export interface LineSeries {
  id: string;
  label: string;
  tone: "orange" | "gray" | "blue" | "green" | "red";
  values: number[];
}

export interface DashboardData {
  tickers: MarketTickerItem[];
  user: UserProfile;
  notificationCount: number;
  candidates: CandidateRow[];
  featured: FeaturedAnalysis;
  newsRadar: NewsItem[];
  marketSummary: KpiMetric[];
  watchlist: SidebarListItem[];
  backtestSeries: LineSeries[];
  backtestMetrics: KpiMetric[];
  sectorStrength: SectorStrengthRow[];
}

export interface FilterOption {
  label: string;
  active?: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface ScreenerFilters {
  themePills: FilterOption[];
  controls: Array<{ label: string; value: string; options: SelectOption[] }>;
}

export interface ScreenerPageData {
  tickers: MarketTickerItem[];
  user: UserProfile;
  notificationCount: number;
  title: string;
  subtitle: string;
  filters: ScreenerFilters;
  rows: SignalRow[];
  marketSummary: KpiMetric[];
  sectorStrength: SectorStrengthRow[];
  realtimeIssues: NewsItem[];
  watchlist: SidebarListItem[];
  sectorMap: SectorStrengthRow[];
  marketFlow: LineSeries[];
  flowMetrics: KpiMetric[];
}

export interface NewsRadarData {
  tickers: MarketTickerItem[];
  user: UserProfile;
  notificationCount: number;
  filters: ScreenerFilters;
  rows: NewsItem[];
  summary: KpiMetric[];
  clusters: SectorStrengthRow[];
  alerts: NewsItem[];
  interestNews: NewsItem[];
  issueMap: SectorStrengthRow[];
  newsFlow: LineSeries[];
  flowMetrics: KpiMetric[];
}

export interface BacktestSummary {
  metrics: KpiMetric[];
  composition: ScoreBreakdownItem[];
  conditions: SidebarListItem[];
  runHistory: SidebarListItem[];
  monthlyReturns: Array<Record<string, string>>;
  riskMetrics: KpiMetric[];
  annualSeries: Array<{ year: string; strategy: number; benchmark: number }>;
  trades: Array<{
    name: string;
    market: string;
    entryDate: string;
    exitDate: string;
    entryPrice: string;
    exitPrice: string;
    returnPercent: string;
    holdingDays: string;
    result: "익절" | "손절" | "보유" | "청산" | "완료" | "실행중";
  }>;
}

export interface BacktestData {
  tickers: MarketTickerItem[];
  user: UserProfile;
  notificationCount: number;
  controls: Array<{ label: string; value: string; options: SelectOption[] }>;
  equityCurve: LineSeries[];
  drawdown: LineSeries[];
  summary: BacktestSummary;
}

export interface WatchlistRow {
  rank: number;
  name: string;
  ticker: string;
  market: string;
  price: string;
  changePercent: string;
  score: number;
  expectedReturn: string;
  riskLevel: RiskLevel;
  signal: SignalLabel;
  alertStatus: "활성" | "가격근접" | "이슈발생" | "OFF";
  memo: string;
}

export interface SignalChangeRow {
  name: string;
  previousSignal: SignalLabel;
  currentSignal: SignalLabel;
  changedAt: string;
  reason: string;
}

export interface WatchlistData {
  tickers: MarketTickerItem[];
  user: UserProfile;
  notificationCount: number;
  controls: Array<{ label: string; value: string; options: SelectOption[] }>;
  rows: WatchlistRow[];
  summary: KpiMetric[];
  alerts: NewsItem[];
  groups: Array<{ name: string; count: number; strong: number; risk: number; alerts: number }>;
  performance: LineSeries[];
  performanceMetrics: KpiMetric[];
  signalHistory: SignalChangeRow[];
  priorityItems: Array<{
    rank: number;
    name: string;
    ticker: string;
    signal: SignalLabel;
    price: string;
    changePercent: string;
    score: number;
    memo: string;
  }>;
}

