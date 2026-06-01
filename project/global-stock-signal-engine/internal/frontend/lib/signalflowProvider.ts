import {
  getBacktestMock,
  getDashboardMock,
  getDomesticMock,
  getNewsRadarMock,
  getOverseasMock,
  getWatchlistMock
} from "@/mocks/signalflowMock";
import type { BacktestData, DashboardData, NewsRadarData, ScreenerPageData, WatchlistData } from "./signalflowTypes";

export async function getDashboardData(): Promise<DashboardData> {
  return getDashboardMock();
}

export async function getDomesticData(): Promise<ScreenerPageData> {
  return getDomesticMock();
}

export async function getOverseasData(): Promise<ScreenerPageData> {
  return getOverseasMock();
}

export async function getNewsRadarData(): Promise<NewsRadarData> {
  return getNewsRadarMock();
}

export async function getBacktestData(): Promise<BacktestData> {
  return getBacktestMock();
}

export async function getWatchlistData(): Promise<WatchlistData> {
  return getWatchlistMock();
}

