"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { Card } from "../ui/Card";
import { buildAreaPath, buildLinePath, getRange } from "./chartUtils";

export interface LineChartSeries {
  id: string;
  label: string;
  data: number[];
  color?: string;
  fill?: string;
}

interface LineChartPanelProps {
  title: ReactNode;
  subtitle?: ReactNode;
  series: LineChartSeries[];
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

export function LineChartPanel({
  title,
  subtitle,
  series,
  xLabels,
  height = 240,
  loading = false,
  error,
  emptyText = "표시할 추세 데이터가 없습니다.",
  footer,
  className
}: LineChartPanelProps) {
  const primarySeries = series[0];
  const allValues = series.flatMap((item) => item.data);
  const sharedRange = getRange(allValues);

  return (
    <Card
      title={title}
      subtitle={subtitle}
      className={clsx(className)}
      actions={
        series.length > 0 ? (
          <div className="flex flex-wrap items-center gap-3">
            {series.map((item) => (
              <div key={item.id} className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--sf-text-secondary)]">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color ?? "var(--sf-accent)" }}
                />
                {item.label}
              </div>
            ))}
          </div>
        ) : null
      }
      bodyClassName="space-y-3"
    >
      {error ? (
        <ChartState height={height}>{error}</ChartState>
      ) : loading ? (
        <ChartState height={height}>데이터를 불러오는 중입니다.</ChartState>
      ) : series.length === 0 || allValues.length === 0 || !primarySeries ? (
        <ChartState height={height}>{emptyText}</ChartState>
      ) : (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-[6px] border border-[var(--sf-border-soft)] bg-white">
            <svg width="100%" height={height} viewBox={`0 0 640 ${height}`} preserveAspectRatio="none">
              {Array.from({ length: 4 }).map((_, index) => {
                const y = 24 + (index * (height - 48)) / 3;
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

              {series.map((item, seriesIndex) => {
                const path = buildLinePath(item.data, 640, height, 24, 24, sharedRange);
                const areaPath = buildAreaPath(item.data, 640, height, 24, 24, sharedRange);
                const color = item.color ?? (seriesIndex === 0 ? "var(--sf-accent)" : "var(--sf-text-secondary)");
                const fill = item.fill ?? (seriesIndex === 0 ? "rgba(255, 90, 0, 0.12)" : "rgba(107, 114, 128, 0.08)");

                return (
                  <g key={item.id}>
                    {seriesIndex === 0 ? <path d={areaPath} fill={fill} /> : null}
                    <path d={path} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
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
