"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon" | "dangerSoft";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-[var(--sf-accent)] bg-[var(--sf-accent)] text-white hover:bg-[var(--sf-accent-hover)] hover:border-[var(--sf-accent-hover)]",
  secondary:
    "border-[var(--sf-border)] bg-white text-[var(--sf-text)] hover:border-[var(--sf-accent)] hover:text-[var(--sf-accent)]",
  ghost:
    "border-transparent bg-transparent text-[var(--sf-text-secondary)] hover:bg-[var(--sf-surface-soft)] hover:text-[var(--sf-text)]",
  icon:
    "border-transparent bg-transparent text-[var(--sf-text-secondary)] hover:bg-[var(--sf-surface-soft)] hover:text-[var(--sf-text)]",
  dangerSoft:
    "border-[var(--sf-danger-soft)] bg-[var(--sf-danger-soft)] text-[var(--sf-positive)] hover:border-[rgba(240,68,56,0.24)] hover:bg-[rgba(240,68,56,0.08)]"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-9 px-3.5 text-[13px]",
  lg: "h-10 px-4 text-[14px]",
  icon: "h-9 w-9 p-0"
};

export function Button({
  variant = "secondary",
  size = variant === "icon" ? "icon" : "md",
  leftIcon,
  rightIcon,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "sf-button whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        variant === "icon" && "rounded-md",
        variant !== "icon" && "rounded-md",
        className
      )}
      {...props}
    >
      {leftIcon ? <span className="inline-flex shrink-0">{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span className="inline-flex shrink-0">{rightIcon}</span> : null}
    </button>
  );
}
