import { LABEL_CLASS, LABEL_TEXT } from "@/lib/constants";
import { formatPercent, formatScore, formatSignedPercent } from "@/lib/formatters";
import type { Signal } from "@/lib/types";
import { ConfidenceBadge } from "./ConfidenceBadge";

export function SignalCard({ signal }: { signal: Signal }) {
  return (
    <section className="rounded border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            {signal.market} · {signal.exchange} · {signal.signal_date}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">{signal.company_name}</h1>
          <p className="mt-1 text-sm text-slate-600">{signal.ticker}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex h-8 items-center rounded border px-3 text-sm font-semibold ${LABEL_CLASS[signal.label]}`}>
            {LABEL_TEXT[signal.label]}
          </span>
          <ConfidenceBadge confidence={signal.confidence} />
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <Metric label="최종점수" value={formatScore(signal.final_score)} />
        <Metric label="상승 가능성" value={formatPercent(signal.p_up)} caption="단독 해석 금지" />
        <Metric label="기대범위" value={formatSignedPercent(signal.expected_return)} />
        <Metric label="하락위험" value={formatPercent(signal.downside_risk)} />
      </div>
    </section>
  );
}

function Metric({ label, value, caption }: { label: string; value: string; caption?: string }) {
  return (
    <div className="rounded border border-line bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-ink">{value}</p>
      {caption ? <p className="mt-1 text-xs text-slate-500">{caption}</p> : null}
    </div>
  );
}

