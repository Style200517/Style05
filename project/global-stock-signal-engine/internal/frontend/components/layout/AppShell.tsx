"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getNavigationFromPath } from "./nav";
import { AppHeader } from "./AppHeader";
import { MarketTickerStrip } from "./MarketTickerStrip";
import { PageContainer } from "./PageContainer";
import { getShellDataForNav } from "@/lib/shellProvider";
import type { MarketTickerItem, NavigationItem, ShellUser } from "./types";

interface AppShellProps {
  children: ReactNode;
  activeNav?: NavigationItem["id"] | null;
  tickerItems?: MarketTickerItem[];
  tickerLoading?: boolean;
  tickerError?: string | null;
  notificationCount?: number;
  user?: ShellUser;
  onSearch?: (query: string) => void;
  className?: string;
  contentClassName?: string;
}

export function AppShell({
  children,
  activeNav,
  tickerItems,
  tickerLoading,
  tickerError,
  notificationCount,
  user,
  onSearch,
  className,
  contentClassName
}: AppShellProps) {
  const pathname = usePathname();
  const resolvedActiveNav = activeNav ?? getNavigationFromPath(pathname);
  const shellData = getShellDataForNav(resolvedActiveNav);
  const resolvedTickerItems = tickerItems ?? shellData.tickerItems;
  const resolvedNotificationCount = notificationCount ?? shellData.notificationCount;
  const resolvedUser = user ?? shellData.user;
  const showTickerLoading = tickerLoading ?? (!tickerError && resolvedTickerItems.length === 0);

  return (
    <div className={clsx("sf-shell flex min-h-screen flex-col", className)}>
      <AppHeader
        activeNav={resolvedActiveNav}
        notificationCount={resolvedNotificationCount}
        user={resolvedUser}
        onSearch={onSearch}
      />
      <MarketTickerStrip items={resolvedTickerItems} loading={showTickerLoading} error={tickerError ?? null} />
      <PageContainer className={clsx("flex-1", contentClassName)}>{children}</PageContainer>
    </div>
  );
}
