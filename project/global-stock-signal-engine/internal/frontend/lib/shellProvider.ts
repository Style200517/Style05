import type {
  MarketTickerItem,
  NavigationKey,
  ShellUser
} from "@/components/layout/types";
import { getShellMock } from "@/mocks/signalflowMock";

export interface ShellData {
  tickerItems: MarketTickerItem[];
  notificationCount: number;
  user: ShellUser;
}

export function getShellDataForNav(nav: NavigationKey | null): ShellData {
  const data = getShellMock(nav);

  return {
    tickerItems: data.tickers,
    notificationCount: data.notificationCount,
    user: {
      name: data.user.name,
      subtitle: "Research workspace",
      initials: data.user.avatarLabel
    }
  };
}
