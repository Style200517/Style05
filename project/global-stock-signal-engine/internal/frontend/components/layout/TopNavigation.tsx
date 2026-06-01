"use client";

import Link from "next/link";
import clsx from "clsx";
import type { NavigationItem } from "./types";
import { NAV_ITEMS } from "./nav";

interface TopNavigationProps {
  activeId?: NavigationItem["id"] | null;
  items?: NavigationItem[];
  className?: string;
}

export function TopNavigation({ activeId, items = NAV_ITEMS, className }: TopNavigationProps) {
  return (
    <nav aria-label="Primary" className={clsx("h-full", className)}>
      <ul className="flex h-full items-stretch gap-8">
        {items.map((item) => {
          const active = item.id === activeId;

          return (
            <li key={item.id} className="h-full">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "relative flex h-full items-center border-b-2 px-0.5 text-[15px] font-semibold transition-colors",
                  active
                    ? "border-[var(--sf-accent)] text-[var(--sf-accent)]"
                    : "border-transparent text-[#374151] hover:text-[var(--sf-text)]"
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
