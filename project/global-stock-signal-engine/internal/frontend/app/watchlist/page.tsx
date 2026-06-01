import { getWatchlistData } from "@/lib/signalflowProvider";
import { WatchlistView } from "@/components/watchlist/WatchlistView";

export default async function WatchlistPage() {
  const data = await getWatchlistData();
  return <WatchlistView data={data} />;
}
