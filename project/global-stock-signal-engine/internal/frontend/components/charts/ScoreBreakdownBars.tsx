"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export interface ScoreBreakdownBarItem {
  id: string;
  label: string;
  value: number;
  max?: number;
  tone?: "accent" | "success" | "warning" | "danger" | "neutral";
  detail?: ReactNode;
}

interface ScoreBreakdownBarsProps {
  title: ReactNode;
  subtitle?: ReactNode;
  items: ScoreBreakdownBarItem[];
  loading?: boolean;
  error?: ReactNode;
  emptyText?: ReactNode;
  className?: string;
}

const toneClasses: Record<NonNullable<ScoreBreakdownBarItem["tone"]>, string> = {
  accent: "bg-[var(--sf-accent)]",
  success: "bg-[var(--sf-success)]",
  warning: "bg-[#d97706]",
  danger: "bg-[var(--sf-positive)]",
  neutral: "bg-[var(--sf-text-secondary)]"
};

function StateRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[160px] items-center justify-center rounded-[6px] border border-dashed border-[var(--sf-border-soft)] text-[13px] text-[var(--sf-text-secondary)]">
      {children}
    </div>
  );
}

export function ScoreBreakdownBars({
  title,
  subtitle,
  items,
  loading = false,
  error,
  emptyText = "점수 구성 데이터가 없습니다.",
  className
}: ScoreBreakdownBarsProps) {
  return (
    <Card title={title} subtitle={subtitle} className={clsx(className)} bodyClassName="space-y-3">
      {error ? (
        <StateRow>{error}</StateRow>
      ) : loading ? (
        <StateRow>데이터를 불러오는 중입니다.</StateRow>
      ) : items.length === 0 ? (
        <StateRow>{emptyText}</StateRow>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const max = item.max ?? 100;
            const percentage = Math.max(0, Math.min(100, (item.value / max) * 100));
            const tone = item.tone ?? "accent";

            return (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-[12px]">
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="truncate font-semibold text-[var(--sf-text)]">{item.label}</span>
                    {item.detail ? <Badge variant="outline">{item.detail}</Badge> : null}
                  </div>
                  <span className="shrink-0 font-semibold text-[var(--sf-text-secondary)]">
                    {item.value}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--sf-muted-chip)]">
                  <div className={clsx("h-full rounded-full", toneClasses[tone])} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
