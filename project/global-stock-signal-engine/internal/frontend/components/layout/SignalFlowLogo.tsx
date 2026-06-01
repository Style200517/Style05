"use client";

import Link from "next/link";
import clsx from "clsx";

type LogoSize = "sm" | "md" | "lg";
type LogoVariant = "full" | "symbol" | "wordmark";

interface SignalFlowLogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  href?: string;
  className?: string;
}

const sizeMap: Record<LogoSize, { icon: number; text: string; gap: string }> = {
  sm: { icon: 22, text: "text-[18px]", gap: "gap-1.5" },
  md: { icon: 28, text: "text-[22px]", gap: "gap-2" },
  lg: { icon: 32, text: "text-[24px]", gap: "gap-2" }
};

function SignalFlowMark({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      className="shrink-0"
    >
      <circle cx="16" cy="16" r="2.4" fill="var(--sf-accent)" />
      <circle
        cx="16"
        cy="16"
        r="7.5"
        stroke="var(--sf-accent)"
        strokeOpacity="0.24"
        strokeWidth="1.8"
      />
      <circle
        cx="16"
        cy="16"
        r="12"
        stroke="var(--sf-accent)"
        strokeOpacity="0.18"
        strokeWidth="1.4"
      />
      <path
        d="M16 5.5a10.5 10.5 0 0 1 10.5 10.5"
        stroke="var(--sf-accent)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16 10.5a5.5 5.5 0 0 1 5.5 5.5"
        stroke="var(--sf-accent)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16 16l7.2-7.2"
        stroke="var(--sf-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M21.2 10.8h2.3"
        stroke="var(--sf-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SignalFlowLogo({
  size = "md",
  variant = "full",
  href = "/dashboard",
  className
}: SignalFlowLogoProps) {
  const config = sizeMap[size];
  const outerGap = variant === "full" ? config.gap : undefined;
  const content = (
    <span className={clsx("inline-flex items-center text-[var(--sf-text)]", outerGap, className)}>
      {variant !== "wordmark" ? <SignalFlowMark size={config.icon} /> : null}
      {(variant === "full" || variant === "wordmark") && (
        <span className={clsx("font-semibold leading-none text-[var(--sf-text)]", config.text)}>
          SignalFlow
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="SignalFlow" className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
