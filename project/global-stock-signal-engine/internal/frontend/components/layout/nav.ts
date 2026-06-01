"use client";

import type { NavigationItem } from "./types";

export const NAV_ITEMS: NavigationItem[] = [
  { id: "dashboard", label: "대시보드", href: "/dashboard" },
  { id: "domestic", label: "국내주식", href: "/domestic" },
  { id: "overseas", label: "해외주식", href: "/overseas" },
  { id: "news-radar", label: "뉴스레이더", href: "/news-radar" },
  { id: "backtest", label: "백테스트", href: "/backtest" },
  { id: "watchlist", label: "관심종목", href: "/watchlist" }
];

export function getNavigationFromPath(pathname: string): NavigationItem["id"] | null {
  if (pathname === "/" || pathname.startsWith("/dashboard")) {
    return "dashboard";
  }

  if (pathname.startsWith("/domestic")) {
    return "domestic";
  }

  if (pathname.startsWith("/overseas")) {
    return "overseas";
  }

  if (pathname.startsWith("/news-radar")) {
    return "news-radar";
  }

  if (pathname.startsWith("/backtest")) {
    return "backtest";
  }

  if (pathname.startsWith("/watchlist")) {
    return "watchlist";
  }

  return null;
}
