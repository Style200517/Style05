import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { getDashboardData } from "@/lib/signalflowProvider";

export default async function DashboardRoutePage() {
  const data = await getDashboardData();
  return <DashboardPage data={data} />;
}
