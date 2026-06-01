import { getNewsRadarData } from "@/lib/signalflowProvider";
import { NewsRadarView } from "@/components/news/NewsRadarView";

export default async function NewsRadarPage() {
  const data = await getNewsRadarData();
  return <NewsRadarView data={data} />;
}
