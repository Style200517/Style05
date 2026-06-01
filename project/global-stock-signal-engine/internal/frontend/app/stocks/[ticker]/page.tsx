import { ModelAuditPanel } from "@/components/ModelAuditPanel";
import { PriceVolumeChart } from "@/components/PriceVolumeChart";
import { RiskFlagBadge } from "@/components/RiskFlagBadge";
import { ScoreBreakdownChart } from "@/components/ScoreBreakdownChart";
import { SignalCard } from "@/components/SignalCard";
import { StockDetailHeader } from "@/components/StockDetailHeader";
import { DISCLAIMER } from "@/lib/constants";
import { getSignal, getStockDetail } from "@/lib/api";

export default async function StockPage({ params }: { params: { ticker: string } }) {
  const [signal, detail] = await Promise.all([getSignal(params.ticker), getStockDetail(params.ticker)]);

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-5 py-6">
      <p className="rounded border border-line bg-white px-4 py-3 text-sm text-slate-700">{DISCLAIMER}</p>
      <SignalCard signal={signal} />
      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <PriceVolumeChart prices={detail.prices} />
        <StockDetailHeader detail={detail} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className="rounded border border-line bg-white p-5">
          <h2 className="text-base font-semibold text-ink">점수 분해</h2>
          <div className="mt-4">
            <ScoreBreakdownChart breakdown={signal.score_breakdown} />
          </div>
        </section>
        <section className="rounded border border-line bg-white p-5">
          <h2 className="text-base font-semibold text-ink">근거와 리스크</h2>
          <div className="mt-4 grid gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-ink">관찰 근거</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                {(signal.bullish_reasons.length ? signal.bullish_reasons : ["표시할 근거가 충분하지 않습니다."]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-ink">주의 근거</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                {(signal.bearish_reasons.length ? signal.bearish_reasons : ["중요 주의 근거가 없습니다."]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-ink">리스크 플래그</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {signal.risk_flags.length ? (
                  signal.risk_flags.map((flag) => <RiskFlagBadge key={flag} label={flag} />)
                ) : (
                  <span className="text-slate-500">중요 플래그 없음</span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <ModelAuditPanel signal={signal} />
    </main>
  );
}

