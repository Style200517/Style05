"use client";

import clsx from "clsx";
import type { HTMLAttributes } from "react";

export type BadgeVariant =
  | "accent"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  accent:
    "border-[rgba(255,90,0,0.18)] bg-[var(--sf-accent-soft)] text-[var(--sf-accent)]",
  secondary: "border-[var(--sf-border)] bg-[var(--sf-muted-chip)] text-[var(--sf-text-secondary)]",
  success: "border-[rgba(22,163,74,0.16)] bg-[var(--sf-success-soft)] text-[var(--sf-success)]",
  warning:
    "border-[rgba(180,83,9,0.14)] bg-[var(--sf-warning-soft)] text-[var(--sf-text-secondary)]",
  danger: "border-[rgba(240,68,56,0.16)] bg-[var(--sf-danger-soft)] text-[var(--sf-positive)]",
  info: "border-[rgba(47,124,246,0.16)] bg-[var(--sf-info-soft)] text-[var(--sf-negative)]",
  neutral: "border-[var(--sf-border)] bg-[var(--sf-muted-chip)] text-[var(--sf-text-secondary)]",
  outline: "border-[var(--sf-border)] bg-white text-[var(--sf-text-secondary)]"
};

export function Badge({ variant = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span className={clsx("sf-badge px-2 py-1", variantClasses[variant], className)} {...props}>
      {children}
    </span>
  );
}
