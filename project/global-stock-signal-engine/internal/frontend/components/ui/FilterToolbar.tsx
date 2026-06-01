"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { Button } from "./Button";

export interface FilterToolbarPill {
  id: string;
  label: string;
  active?: boolean;
  count?: number;
  disabled?: boolean;
  onClick?: () => void;
}

export interface FilterToolbarPillGroup {
  id: string;
  label?: ReactNode;
  items: FilterToolbarPill[];
}

export interface FilterToolbarControl {
  id: string;
  label?: ReactNode;
  content: ReactNode;
  className?: string;
}

export interface FilterToolbarAction {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "dangerSoft";
}

interface FilterToolbarProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  pillGroups?: FilterToolbarPillGroup[];
  controls?: FilterToolbarControl[];
  primaryAction?: FilterToolbarAction;
  secondaryAction?: FilterToolbarAction;
  className?: string;
}

function Pill({ pill }: { pill: FilterToolbarPill }) {
  return (
    <button
      type="button"
      disabled={pill.disabled}
      onClick={pill.onClick}
      className={clsx(
        "sf-button h-8 rounded-full border px-3 text-[12px] font-semibold",
        pill.active
          ? "border-[rgba(255,90,0,0.18)] bg-[var(--sf-accent-soft)] text-[var(--sf-accent)]"
          : "border-[var(--sf-border)] bg-white text-[var(--sf-text-secondary)] hover:border-[var(--sf-accent)] hover:text-[var(--sf-accent)]",
        pill.disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span>{pill.label}</span>
      {typeof pill.count === "number" ? (
        <span className="text-[11px] font-medium text-[var(--sf-text-muted)]">({pill.count})</span>
      ) : null}
    </button>
  );
}

export function FilterToolbar({
  title,
  subtitle,
  pillGroups = [],
  controls = [],
  primaryAction,
  secondaryAction,
  className
}: FilterToolbarProps) {
  return (
    <section className={clsx("sf-card overflow-hidden", className)}>
      {(title || subtitle || primaryAction || secondaryAction) && (
        <div className="flex min-h-[46px] items-start justify-between gap-3 border-b border-[var(--sf-border-soft)] px-4 py-3">
          <div className="min-w-0">
            {title ? (
              <div className="truncate text-[16px] font-semibold leading-5 text-[var(--sf-text)]">
                {title}
              </div>
            ) : null}
            {subtitle ? (
              <div className="mt-1 text-[12px] leading-4 text-[var(--sf-text-secondary)]">
                {subtitle}
              </div>
            ) : null}
          </div>

          {primaryAction || secondaryAction ? (
            <div className="flex shrink-0 items-center gap-2">
              {secondaryAction ? (
                <Button
                  type="button"
                  variant={secondaryAction.variant ?? "secondary"}
                  onClick={secondaryAction.onClick}
                  disabled={secondaryAction.disabled}
                >
                  {secondaryAction.label}
                </Button>
              ) : null}
              {primaryAction ? (
                <Button
                  type="button"
                  variant={primaryAction.variant ?? "primary"}
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled}
                >
                  {primaryAction.label}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      )}

      <div className="space-y-3 px-4 py-3">
        {pillGroups.map((group) => (
          <div key={group.id} className="flex flex-wrap items-center gap-3">
            {group.label ? (
              <div className="min-w-[72px] text-[12px] font-semibold text-[var(--sf-text-secondary)]">
                {group.label}
              </div>
            ) : null}
            <div className="flex flex-1 flex-wrap gap-2">
              {group.items.map((pill) => (
                <Pill key={pill.id} pill={pill} />
              ))}
            </div>
          </div>
        ))}

        {controls.length > 0 ? (
          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
            {controls.map((control) => (
              <div key={control.id} className={clsx("min-w-0", control.className)}>
                {control.label ? (
                  <div className="mb-1 text-[12px] font-semibold text-[var(--sf-text-secondary)]">
                    {control.label}
                  </div>
                ) : null}
                {control.content}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
