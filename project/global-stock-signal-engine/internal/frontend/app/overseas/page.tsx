import { ScreenerPage } from "@/components/screener/ScreenerPage";
import { getOverseasData } from "@/lib/signalflowProvider";

export default async function OverseasPage() {
  const data = await getOverseasData();
  return <ScreenerPage data={data} variant="overseas" />;
}
