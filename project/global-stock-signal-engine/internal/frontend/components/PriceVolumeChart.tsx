import { compactNumber } from "@/lib/formatters";
import type { DailyPrice } from "@/lib/types";

export function PriceVolumeChart({ prices }: { prices: DailyPrice[] }) {
  const visible = prices.slice(-60);
  if (!visible.length) {
    return <div className="rounded border border-line bg-white p-5 text-sm text-slate-500">가격 데이터가 없습니다.</div>;
  }

  const closes = visible.map((item) => item.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const points = visible
    .map((item, index) => {
      const x = (index / Math.max(1, visible.length - 1)) * 100;
      const y = 100 - ((item.close - min) / Math.max(1, max - min)) * 92 - 4;
      return `${x},${y}`;
    })
    .join(" ");
  const latest = visible[visible.length - 1];

  return (
    <section className="rounded border border-line bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">가격·거래량</h2>
          <p className="text-sm text-slate-500">최근 {visible.length}개 샘플 일봉</p>
        </div>
        <div className="text-right text-sm">
          <p className="font-semibold text-ink">{latest.close.toLocaleString()}</p>
          <p className="text-slate-500">거래량 {compactNumber(latest.volume)}</p>
        </div>
      </div>
      <svg viewBox="0 0 100 100" className="h-48 w-full overflow-visible">
        <polyline points={points} fill="none" stroke="#0f766e" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
      </svg>
    </section>
  );
}

