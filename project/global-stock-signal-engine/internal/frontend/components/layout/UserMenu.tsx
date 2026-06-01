"use client";

import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { Button } from "../ui/Button";
import type { ShellUser } from "./types";

interface UserMenuProps {
  user?: ShellUser;
  onClick?: () => void;
  className?: string;
}

function getInitials(name?: string, fallback = "S") {
  if (!name) {
    return fallback;
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return fallback;
  }

  const pieces = trimmed.split(/\s+/);
  if (pieces.length === 1) {
    return pieces[0].slice(0, 1).toUpperCase();
  }

  return `${pieces[0].slice(0, 1)}${pieces[1].slice(0, 1)}`.toUpperCase();
}

export function UserMenu({ user, onClick, className }: UserMenuProps) {
  const name = user?.name?.trim() || "계정";
  const subtitle = user?.subtitle?.trim();
  const initials = user?.initials?.trim() || getInitials(user?.name);

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={clsx("h-9 min-w-[160px] justify-start gap-2 px-2.5", className)}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--sf-accent-soft)] text-[12px] font-semibold text-[var(--sf-accent)]">
        {initials}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-[13px] font-semibold leading-4 text-[var(--sf-text)]">
          {name}
        </span>
        {subtitle ? (
          <span className="block truncate text-[11px] leading-4 text-[var(--sf-text-muted)]">
            {subtitle}
          </span>
        ) : null}
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-[var(--sf-text-muted)]" />
    </Button>
  );
}
