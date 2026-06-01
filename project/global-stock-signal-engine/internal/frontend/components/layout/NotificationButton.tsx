"use client";

import { Bell } from "lucide-react";
import clsx from "clsx";
import { Button } from "../ui/Button";

interface NotificationButtonProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function NotificationButton({ count = 0, onClick, className }: NotificationButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label="알림"
      className={clsx("relative", className)}
    >
      <Bell className="h-4 w-4" />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--sf-accent)] text-[10px] font-semibold leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Button>
  );
}
