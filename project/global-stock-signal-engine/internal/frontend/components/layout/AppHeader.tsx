"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "./types";
import type { ShellUser } from "./types";
import { getNavigationFromPath, NAV_ITEMS } from "./nav";
import { SignalFlowLogo } from "./SignalFlowLogo";
import { TopNavigation } from "./TopNavigation";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationButton } from "./NotificationButton";
import { UserMenu } from "./UserMenu";

interface AppHeaderProps {
  activeNav?: NavigationItem["id"] | null;
  notificationCount?: number;
  user?: ShellUser;
  onSearch?: (query: string) => void;
  className?: string;
}

export function AppHeader({
  activeNav,
  notificationCount = 0,
  user,
  onSearch,
  className
}: AppHeaderProps) {
  const pathname = usePathname();
  const resolvedActiveNav = activeNav ?? getNavigationFromPath(pathname);

  return (
    <header className={clsx("h-[58px] border-b border-[var(--sf-border)] bg-white", className)}>
      <div className="flex h-full items-center gap-4 px-6">
        <div className="flex min-w-[210px] items-center">
          <SignalFlowLogo size="md" variant="full" />
        </div>

        <div className="min-w-0 flex-1">
          <TopNavigation items={NAV_ITEMS} activeId={resolvedActiveNav} />
        </div>

        <div className="flex items-center gap-2">
          <GlobalSearch onSubmit={onSearch} />
          <NotificationButton count={notificationCount} />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
