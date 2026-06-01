"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { Card } from "../ui/Card";
import { getRange } from "./chartUtils";

export interface BarChartItem {
  id: string;
  label: string;
  value: number;
  color?: string;
  subtitle?: string;
}

interface BarChartPanelProps {
  title: ReactNode;
  subtitle?: ReactNode;
  bars: BarChartItem[];
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

export function BarChartPanel({
  title,
  subtitle,
  bars,
  height = 220,
  loading = false,
  error,
  emptyText = "표시할 막대 데이터가 없습니다.",
  footer,
  className
}: BarChartPanelProps) {
  const values = bars.map((bar) => bar.value);
  const range = getRange(values, 0.04);

  return (
    <Card title={title} subtitle={subtitle} className={clsx(className)} bodyClassName="space-y-3">
      {error ? (
        <ChartState height={height}>{error}</ChartState>
      ) : loading ? (
        <ChartState height={height}>데이터를 불러오는 중입니다.</ChartState>
      ) : bars.length === 0 ? (
        <ChartState height={height}>{emptyText}</ChartState>
      ) : (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-[6px] border border-[var(--sf-border-soft)] bg-white px-3 py-3">
            <svg width="100%" height={height} viewBox={`0 0 640 ${height}`} preserveAspectRatio="none">
              {(() => {
                const plotTop = 18;
                const plotBottom = height - 42;
                const plotHeight = plotBottom - plotTop;

                return Array.from({ length: 4 }).map((_, index) => {
                  const y = plotTop + (index * plotHeight) / 3;
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
                });
              })()}

              {bars.map((bar, index) => {
                const count = bars.length;
                const step = 592 / Math.max(count, 1);
                const barWidth = Math.min(42, step * 0.52);
                const x = 24 + step * index + (step - barWidth) / 2;
                const plotTop = 18;
                const plotBottom = height - 42;
                const plotHeight = plotBottom - plotTop;
                const valueHeight = ((bar.value - range.min) / (range.max - range.min || 1)) * plotHeight;
                const barY = plotBottom - valueHeight;
                const color = bar.color ?? (index === 0 ? "var(--sf-accent)" : "rgba(107, 114, 128, 0.88)");

                return (
                  <g key={bar.id}>
                    <rect x={x} y={barY} width={barWidth} height={Math.max(4, valueHeight)} rx="4" fill={color} />
                    <text
                      x={x + barWidth / 2}
                      y={barY - 8}
                      textAnchor="middle"
                      className="fill-[var(--sf-text-secondary)] text-[11px] font-semibold"
                    >
                      {bar.value}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={198}
                      textAnchor="middle"
                      className="fill-[var(--sf-text-secondary)] text-[11px] font-medium"
                    >
                      {bar.label}
                    </text>
                    {bar.subtitle ? (
                      <text
                        x={x + barWidth / 2}
                        y={210}
                        textAnchor="middle"
                        className="fill-[var(--sf-text-muted)] text-[10px] font-medium"
                      >
                        {bar.subtitle}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </svg>
          </div>
          {footer ? <div className="text-[12px] leading-5 text-[var(--sf-text-secondary)]">{footer}</div> : null}
        </div>
      )}
    </Card>
  );
}
