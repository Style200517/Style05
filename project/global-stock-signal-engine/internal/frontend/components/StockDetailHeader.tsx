import type { StockDetail } from "@/lib/types";

export function StockDetailHeader({ detail }: { detail: StockDetail }) {
  return (
    <div className="rounded border border-line bg-white p-5">
      <p className="text-sm text-slate-500">
        {detail.stock.market} · {detail.stock.exchange} · {detail.stock.currency}
      </p>
      <h2 className="mt-1 text-xl font-semibold text-ink">
        {detail.stock.company_name_kr ?? detail.stock.company_name}
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        {detail.stock.sector} / {detail.stock.industry}
      </p>
    </div>
  );
}

