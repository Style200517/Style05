import { getBacktestData } from "@/lib/signalflowProvider";
import { BacktestView } from "@/components/backtest/BacktestView";

export default async function BacktestPage() {
  const data = await getBacktestData();
  return <BacktestView data={data} />;
}
