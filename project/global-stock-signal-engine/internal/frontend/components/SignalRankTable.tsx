"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LABEL_CLASS, LABEL_TEXT } from "@/lib/constants";
import { formatPercent, formatScore, formatSignedPercent } from "@/lib/formatters";
import type { Signal } from "@/lib/types";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { FilterBar } from "./FilterBar";
import { RiskFlagBadge } from "./RiskFlagBadge";

export function SignalRankTable({ signals }: { signals: Signal[] }) {
  const [market, setMarket] = useState("all");
  const [label, setLabel] = useState("all");
  const [minScore, setMinScore] = useState(0);

  const filteredSignals = useMemo(() => {
    return signals.filter((signal) => {
      const marketMatch = market === "all" || signal.market === market;
      const labelMatch = label === "all" || signal.label === label;
      return marketMatch && labelMatch && signal.final_score >= minScore;
    });
  }, [signals, market, label, minScore]);

  return (
    <section className="overflow-hidden rounded border border-line bg-white">
      <FilterBar
        market={market}
        label={label}
        minScore={minScore}
        onMarketChange={setMarket}
        onLabelChange={setLabel}
        onMinScoreChange={setMinScore}
      />
      <div className="overflow-x-auto">
        <table className="min-w-[1080px] w-full border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">종목</th>
              <th className="px-4 py-3">시장</th>
              <th className="px-4 py-3">최종점수</th>
              <th className="px-4 py-3">상승 가능성</th>
              <th className="px-4 py-3">기대범위</th>
              <th className="px-4 py-3">하락위험</th>
              <th className="px-4 py-3">신뢰도</th>
              <th className="px-4 py-3">주요 근거</th>
              <th className="px-4 py-3">리스크</th>
              <th className="px-4 py-3">라벨</th>
            </tr>
          </thead>
          <tbody>
            {filteredSignals.map((signal) => (
              <tr key={signal.ticker} className="border-t border-line align-top">
                <td className="px-4 py-4">
                  <Link href={`/stocks/${signal.ticker}`} className="font-semibold text-ink hover:text-accent">
                    {signal.company_name}
                  </Link>
                  <div className="mt-1 text-xs text-slate-500">{signal.ticker}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium">{signal.market}</div>
                  <div className="text-xs text-slate-500">{signal.exchange}</div>
                </td>
                <td className="px-4 py-4 font-semibold">{formatScore(signal.final_score)}</td>
                <td className="px-4 py-4">
                  <div className="font-medium">{formatPercent(signal.p_up)}</div>
                  <div className="text-xs text-slate-500">근거·리스크와 함께 해석</div>
                </td>
                <td className="px-4 py-4">{formatSignedPercent(signal.expected_return)}</td>
                <td className="px-4 py-4">{formatPercent(signal.downside_risk)}</td>
                <td className="px-4 py-4">
                  <ConfidenceBadge confidence={signal.confidence} />
                </td>
                <td className="max-w-[250px] px-4 py-4 text-slate-700">
                  {signal.bullish_reasons[0] ?? "표시할 주요 근거가 충분하지 않습니다."}
                </td>
                <td className="max-w-[260px] px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {signal.risk_flags.length ? (
                      signal.risk_flags.slice(0, 2).map((flag) => <RiskFlagBadge key={flag} label={flag} />)
                    ) : (
                      <span className="text-slate-500">중요 플래그 없음</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded border px-2 py-1 text-xs font-semibold ${LABEL_CLASS[signal.label]}`}>
                    {LABEL_TEXT[signal.label]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

