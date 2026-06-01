import { fallbackSignals, fallbackStockDetail } from "./mockData";
import type { Signal, SignalListResponse, StockDetail } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 15 }
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${path}`);
  }
  return response.json() as Promise<T>;
}

export async function getTodaySignals(): Promise<SignalListResponse> {
  try {
    return await getJson<SignalListResponse>("/api/signals/today");
  } catch {
    return fallbackSignals;
  }
}

export async function getSignal(ticker: string): Promise<Signal> {
  try {
    return await getJson<Signal>(`/api/signals/${ticker}`);
  } catch {
    return fallbackSignals.signals[0];
  }
}

export async function getStockDetail(ticker: string): Promise<StockDetail> {
  try {
    return await getJson<StockDetail>(`/api/stocks/${ticker}`);
  } catch {
    return fallbackStockDetail;
  }
}

