import { ScreenerPage } from "@/components/screener/ScreenerPage";
import { getDomesticData } from "@/lib/signalflowProvider";

export default async function DomesticPage() {
  const data = await getDomesticData();
  return <ScreenerPage data={data} variant="domestic" />;
}
