"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

export type CardSize = "default" | "dense" | "tight";

interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  size?: CardSize;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
}

const bodyPadding: Record<CardSize, string> = {
  default: "p-4",
  dense: "p-3",
  tight: "p-2.5"
};

export function Card({
  title,
  subtitle,
  actions,
  children,
  size = "default",
  className,
  bodyClassName,
  headerClassName
}: CardProps) {
  const hasHeader = Boolean(title || subtitle || actions);

  return (
    <section className={clsx("sf-card overflow-hidden", className)}>
      {hasHeader ? (
        <div className={clsx("sf-card-header", headerClassName)}>
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
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <div className={clsx(bodyPadding[size], bodyClassName)}>{children}</div>
    </section>
  );
}
