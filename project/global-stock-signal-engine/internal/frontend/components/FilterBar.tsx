"use client";

import type { SignalLabel } from "@/lib/types";

interface FilterBarProps {
  market: string;
  label: string;
  minScore: number;
  onMarketChange: (value: string) => void;
  onLabelChange: (value: string) => void;
  onMinScoreChange: (value: number) => void;
}

export function FilterBar({
  market,
  label,
  minScore,
  onMarketChange,
  onLabelChange,
  onMinScoreChange
}: FilterBarProps) {
  const labels: Array<{ value: SignalLabel | "all"; text: string }> = [
    { value: "all", text: "전체 라벨" },
    { value: "strong_watch", text: "강한 관찰 후보" },
    { value: "watch", text: "관찰 후보" },
    { value: "neutral", text: "중립" },
    { value: "risk", text: "주의" },
    { value: "exclude", text: "제외" }
  ];

  return (
    <div className="grid gap-3 border-b border-line bg-white p-4 md:grid-cols-[180px_220px_1fr]">
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-slate-600">시장</span>
        <select
          value={market}
          onChange={(event) => onMarketChange(event.target.value)}
          className="h-10 rounded border border-line bg-white px-3"
        >
          <option value="all">전체</option>
          <option value="KR">국내</option>
          <option value="US">미국</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-slate-600">라벨</span>
        <select
          value={label}
          onChange={(event) => onLabelChange(event.target.value)}
          className="h-10 rounded border border-line bg-white px-3"
        >
          {labels.map((item) => (
            <option key={item.value} value={item.value}>
              {item.text}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-slate-600">최소 점수: {minScore}</span>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={minScore}
          onChange={(event) => onMinScoreChange(Number(event.target.value))}
          className="h-10"
        />
      </label>
    </div>
  );
}

