"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { Card } from "../ui/Card";
import { buildCandleGeometry, type Candle } from "./chartUtils";

export interface CandlestickItem extends Candle {
  id: string;
  label?: string;
}

interface CandlestickPanelProps {
  title: ReactNode;
  subtitle?: ReactNode;
  candles: CandlestickItem[];
  xLabels?: string[];
  height?: number;
  loading?: boolean;
  error?: ReactNode;
  emptyText?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

function ChartState({ children, height }: { children: ReactNode; height: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-[6px] border border-dashed border-[var(--sf-border-soft)] text-[13px] text-[var(--sf-text-secondary)]"
      style={{ height }}
    >
      {children}
    </div>
  );
}

export function CandlestickPanel({
  title,
  subtitle,
  candles,
  xLabels,
  height = 240,
  loading = false,
  error,
  emptyText = "표시할 캔들 데이터가 없습니다.",
  footer,
  className
}: CandlestickPanelProps) {
  const { geometries } = buildCandleGeometry(
    candles.map(({ open, high, low, close }) => ({ open, high, low, close })),
    640,
    height,
    24,
    18
  );

  return (
    <Card title={title} subtitle={subtitle} className={clsx(className)} bodyClassName="space-y-3">
      {error ? (
        <ChartState height={height}>{error}</ChartState>
      ) : loading ? (
        <ChartState height={height}>데이터를 불러오는 중입니다.</ChartState>
      ) : candles.length === 0 ? (
        <ChartState height={height}>{emptyText}</ChartState>
      ) : (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-[6px] border border-[var(--sf-border-soft)] bg-white px-3 py-3">
            <svg width="100%" height={height} viewBox={`0 0 640 ${height}`} preserveAspectRatio="none">
              {Array.from({ length: 4 }).map((_, index) => {
                const y = 24 + (index * (height - 52)) / 3;
                return (
                  <line
                    key={index}
                    x1="24"
                    x2="616"
                    y1={y}
                    y2={y}
                    stroke="var(--sf-divider)"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                  />
                );
              })}

              {geometries.map((candle, index) => {
                const color = candle.isUp ? "var(--sf-positive)" : "var(--sf-negative)";

                return (
                  <g key={candles[index]?.id ?? index}>
                    <line
                      x1={candle.x + 6}
                      x2={candle.x + 6}
                      y1={candle.wickTop}
                      y2={candle.wickBottom}
                      stroke={color}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <rect
                      x={candle.x}
                      y={candle.bodyY}
                      width="12"
                      height={Math.max(2, candle.bodyHeight)}
                      rx="2"
                      fill={candle.isUp ? "rgba(240, 68, 56, 0.18)" : "rgba(47, 124, 246, 0.18)"}
                      stroke={color}
                      strokeWidth="1.2"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {xLabels && xLabels.length > 0 ? (
            <div className="flex items-center justify-between px-1 text-[11px] text-[var(--sf-text-muted)]">
              {xLabels.map((label, index) => (
                <span key={`${label}-${index}`} className="truncate">
                  {label}
                </span>
              ))}
            </div>
          ) : null}

          {footer ? <div className="text-[12px] leading-5 text-[var(--sf-text-secondary)]">{footer}</div> : null}
        </div>
      )}
    </Card>
  );
}
