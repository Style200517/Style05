export function MarketRegimePanel() {
  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-5 py-4 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Mode</p>
          <p className="mt-1 text-sm text-ink">MVP 1 sample-data scoring</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Horizon</p>
          <p className="mt-1 text-sm text-ink">5 trading days, research label only</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Validation</p>
          <p className="mt-1 text-sm text-ink">Backtest module designed, not yet trusted</p>
        </div>
      </div>
    </section>
  );
}

