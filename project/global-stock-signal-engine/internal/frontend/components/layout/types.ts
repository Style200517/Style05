export type NavigationKey =
  | "dashboard"
  | "domestic"
  | "overseas"
  | "news-radar"
  | "backtest"
  | "watchlist";

export interface NavigationItem {
  id: NavigationKey;
  label: string;
  href: string;
}

export type MarketTickerDirection = "up" | "down" | "flat";

export interface MarketTickerItem {
  id: string;
  label: string;
  value: string;
  change: string;
  changePercent: string;
  direction: MarketTickerDirection;
  sparkline: number[];
}

export interface ShellUser {
  name?: string;
  subtitle?: string;
  initials?: string;
}
