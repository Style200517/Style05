"use client";

import clsx from "clsx";
import type { MarketTickerItem } from "./types";
import { Sparkline } from "../ui/Sparkline";

interface MarketTickerStripProps {
  items?: MarketTickerItem[];
  loading?: boolean;
  error?: string | null;
  emptyText?: string;
  className?: string;
}

function TickerSkeleton() {
  return (
    <div className="flex h-full items-center gap-4 px-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex min-w-[300px] flex-1 items-center justify-between border-r border-[var(--sf-divider)] pr-4 last:border-r-0"
        >
          <div className="min-w-0 flex-1">
            <div className="h-3 w-16 rounded bg-[var(--sf-muted-chip)]" />
            <div className="mt-2 h-5 w-24 rounded bg-[var(--sf-muted-chip)]" />
            <div className="mt-1 h-3 w-20 rounded bg-[var(--sf-muted-chip)]" />
          </div>
          <div className="ml-4 h-8 w-[110px] rounded bg-[var(--sf-muted-chip)]" />
        </div>
      ))}
    </div>
  );
}

export function MarketTickerStrip({
  items = [],
  loading,
  error,
  emptyText = "표시할 시장 지표가 없습니다.",
  className
}: MarketTickerStripProps) {
  const isLoading = loading ?? (!error && items.length === 0);

  return (
    <section
      className={clsx(
        "h-[74px] border-b border-[var(--sf-border)] bg-white",
        className
      )}
    >
      {error ? (
        <div className="flex h-full items-center px-4 text-sm text-[var(--sf-text-secondary)]">
          {error}
        </div>
      ) : isLoading ? (
        <TickerSkeleton />
      ) : items.length === 0 ? (
        <div className="flex h-full items-center px-4 text-sm text-[var(--sf-text-secondary)]">
          {emptyText}
        </div>
      ) : (
        <div className="flex h-full items-stretch overflow-x-auto">
          {items.map((item, index) => {
            const positive = item.direction === "up";
            const negative = item.direction === "down";
            const toneClass = positive
              ? "text-[var(--sf-positive)]"
              : negative
                ? "text-[var(--sf-negative)]"
                : "text-[var(--sf-text-secondary)]";

            return (
              <div
                key={item.id}
                className={clsx(
                  "flex min-w-[300px] flex-1 items-center justify-between gap-4 px-4 py-3",
                  index < items.length - 1 && "border-r border-[var(--sf-divider)]"
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-semibold leading-4 text-[var(--sf-text-secondary)]">
                    {item.label}
                  </div>
                  <div className={clsx("mt-1 text-[21px] font-semibold leading-none", toneClass)}>
                    {item.value}
                  </div>
                  <div className={clsx("mt-1 text-[12px] font-medium leading-4", toneClass)}>
                    {item.change} ({item.changePercent})
                  </div>
                </div>
                <Sparkline
                  data={item.sparkline}
                  width={118}
                  height={32}
                  stroke={positive ? "var(--sf-positive)" : negative ? "var(--sf-negative)" : "var(--sf-text-secondary)"}
                  fill={positive ? "rgba(240, 68, 56, 0.12)" : negative ? "rgba(47, 124, 246, 0.12)" : "rgba(107, 114, 128, 0.08)"}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
