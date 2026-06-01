import type { Signal } from "@/lib/types";

export function ModelAuditPanel({ signal }: { signal: Signal }) {
  return (
    <section className="rounded border border-line bg-white p-5">
      <h2 className="text-base font-semibold text-ink">모델 감사</h2>
      <dl className="mt-4 grid gap-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">표본 수</dt>
          <dd className="font-medium text-ink">{signal.sample_size}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">검증 상태</dt>
          <dd className="font-medium text-ink">{signal.backtest.status}</dd>
        </div>
        <div>
          <dt className="text-slate-500">검증 메모</dt>
          <dd className="mt-1 text-slate-700">{signal.backtest.summary}</dd>
        </div>
        <div>
          <dt className="text-slate-500">소스</dt>
          <dd className="mt-1 flex flex-wrap gap-2">
            {signal.source_refs.map((source) => (
              <span key={source} className="rounded border border-line bg-slate-50 px-2 py-1 text-xs text-slate-700">
                {source}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </section>
  );
}

