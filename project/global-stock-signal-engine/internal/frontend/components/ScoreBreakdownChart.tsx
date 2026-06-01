import type { ScoreBreakdown } from "@/lib/types";

const ITEMS: Array<[keyof ScoreBreakdown, string, "score" | "penalty"]> = [
  ["price_signal_score", "가격 신호", "score"],
  ["market_regime_score", "시장상황", "score"],
  ["news_event_score", "뉴스 이벤트", "score"],
  ["fundamental_score", "재무", "score"],
  ["liquidity_score", "유동성", "score"],
  ["relative_strength_score", "상대강도", "score"],
  ["risk_penalty", "리스크 차감", "penalty"]
];

export function ScoreBreakdownChart({ breakdown }: { breakdown: ScoreBreakdown }) {
  return (
    <div className="space-y-3">
      {ITEMS.map(([key, label, kind]) => {
        const value = breakdown[key];
        const width = Math.max(2, Math.min(100, value));
        return (
          <div key={key} className="grid grid-cols-[92px_1fr_48px] items-center gap-3 text-sm">
            <span className="text-slate-600">{label}</span>
            <div className="h-2 rounded bg-slate-100">
              <div
                className={`h-2 rounded ${kind === "penalty" ? "bg-amber-500" : "bg-teal-600"}`}
                style={{ width: `${width}%` }}
              />
            </div>
            <span className="text-right font-medium text-ink">{value.toFixed(1)}</span>
          </div>
        );
      })}
    </div>
  );
}

