import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Download, Filter, RotateCcw, SlidersHorizontal } from "lucide-react";
import type {
  KpiMetric,
  LineSeries,
  NewsItem,
  ScreenerPageData,
  SectorStrengthRow,
  SignalRow,
  SignalLabel,
  StatusTone
} from "@/lib/signalflowTypes";

const SIGNAL_LABELS: Record<SignalLabel, string> = {
  strong_watch: "강한 관찰",
  watch: "관찰",
  neutral: "중립",
  risk: "주의",
  exclude: "제외"
};

const SIGNAL_STYLES: Record<SignalLabel, string> = {
  strong_watch: "border-[#ff5a00] bg-[#fff2e8] text-[#c2410c]",
  watch: "border-emerald-300 bg-emerald-50 text-emerald-700",
  neutral: "border-slate-300 bg-slate-50 text-slate-700",
  risk: "border-amber-300 bg-amber-50 text-amber-800",
  exclude: "border-red-300 bg-red-50 text-red-700"
};

const RISK_STYLES: Record<SignalRow["riskLevel"], string> = {
  low: "border-emerald-300 bg-emerald-50 text-emerald-700",
  medium: "border-amber-300 bg-amber-50 text-amber-800",
  high: "border-red-300 bg-red-50 text-red-700"
};

const LABEL_STYLE: Record<NewsItem["type"], string> = {
  호재: "border-[#ffd0bc] bg-[#fff2e8] text-[#c2410c]",
  악재: "border-red-200 bg-red-50 text-red-700",
  공시: "border-blue-200 bg-blue-50 text-blue-700",
  수급: "border-violet-200 bg-violet-50 text-violet-700",
  실적: "border-emerald-200 bg-emerald-50 text-emerald-700",
  매크로: "border-slate-200 bg-slate-50 text-slate-700",
  가격: "border-cyan-200 bg-cyan-50 text-cyan-700",
  이슈: "border-amber-200 bg-amber-50 text-amber-800",
  확인: "border-blue-200 bg-blue-50 text-blue-700",
  관찰: "border-slate-200 bg-slate-50 text-slate-700"
};

export function ScreenerPage({ data, variant }: { data: ScreenerPageData; variant: "domestic" | "overseas" }) {
  const summaryTitle = variant === "domestic" ? "국내 시장 요약" : "해외 시장 요약";
  const watchlistTitle = variant === "domestic" ? "내 관심 국내종목" : "내 관심 해외종목";
  const issueTitle = variant === "domestic" ? "실시간 이슈" : "실시간 이슈";
  const mapTitle = variant === "domestic" ? "국내 업종 맵" : "해외 업종 맵";
  const flowTitle = variant === "domestic" ? "국내 시장 흐름" : "해외 시장 흐름";

  return (
    <main className="w-full px-4 py-4">
      <div className="space-y-4">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_456px]">
          <div className="space-y-4">
            <FilterCard data={data} variant={variant} />
            <MainTableCard data={data} />
          </div>

          <aside className="space-y-4">
            <SidebarCard title={summaryTitle} accent="primary">
              <KpiGrid metrics={data.marketSummary} />
            </SidebarCard>
            <SidebarCard title="섹터 강도 TOP 5" accent="neutral">
              <SectorList rows={data.sectorStrength.slice(0, 5)} />
            </SidebarCard>
            <SidebarCard title={issueTitle} accent="warning">
              <IssueList rows={data.realtimeIssues} />
            </SidebarCard>
            <SidebarCard title={watchlistTitle} accent="info">
              <WatchlistList items={data.watchlist.slice(0, 5)} />
            </SidebarCard>
          </aside>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <SidebarCard title={mapTitle} accent="primary" className="min-h-[320px]">
            <SectorMap rows={data.sectorMap} />
          </SidebarCard>
          <SidebarCard title={flowTitle} accent="neutral" className="min-h-[320px]">
            <MarketFlow rows={data.marketFlow} metrics={data.flowMetrics} />
          </SidebarCard>
        </section>
      </div>
    </main>
  );
}

function FilterCard({ data, variant }: { data: ScreenerPageData; variant: "domestic" | "overseas" }) {
  const marketLabel = variant === "domestic" ? "시장/테마" : "시장/테마";

  return (
    <section className="rounded-lg border border-line bg-white">
      <div className="border-b border-line px-4 py-3">
        <div className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <Filter className="h-4 w-4 text-[#c2410c]" />
          <span>{marketLabel}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {data.filters.themePills.map((pill) => (
            <button
              key={pill.label}
              type="button"
              className={clsx(
                "h-8 rounded-full border px-3 text-[12px] font-semibold",
                pill.active ? "border-[#ff5a00] bg-[#fff2e8] text-[#c2410c]" : "border-line bg-white text-slate-600"
              )}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 px-4 py-3 xl:grid-cols-[repeat(5,minmax(0,1fr))_auto_auto]">
        {data.filters.controls.slice(0, 5).map((control) => (
          <ControlPill key={control.label} label={control.label} value={control.value} />
        ))}
        <ActionButton icon={<SlidersHorizontal className="h-4 w-4" />} label="검색/필터 적용" tone="primary" />
        <ActionButton icon={<RotateCcw className="h-4 w-4" />} label="초기화" tone="ghost" />
      </div>
    </section>
  );
}

function MainTableCard({ data }: { data: ScreenerPageData }) {
  return (
    <section className="rounded-lg border border-line bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">{data.title}</h2>
          <p className="mt-1 text-[12px] text-slate-500">{data.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <ActionButton icon={<SlidersHorizontal className="h-4 w-4" />} label="컬럼 설정" tone="ghost" />
          <ActionButton icon={<Download className="h-4 w-4" />} label="내보내기" tone="ghost" />
        </div>
      </header>
      <div className="overflow-hidden">
        <table className="w-full border-collapse text-[13px]">
          <thead className="bg-[#fbfcfe] text-left text-[12px] font-semibold text-slate-500">
            <tr className="border-b border-line">
              <th className="px-4 py-3">순위</th>
              <th className="px-4 py-3">종목명</th>
              <th className="px-4 py-3">티커</th>
              <th className="px-4 py-3">시장</th>
              <th className="px-4 py-3 text-right">현재가</th>
              <th className="px-4 py-3 text-right">등락률</th>
              <th className="px-4 py-3 text-right">거래대금</th>
              <th className="px-4 py-3 text-right">시가총액</th>
              <th className="px-4 py-3 text-right">상승 가능성 점수</th>
              <th className="px-4 py-3 text-right">기대수익률</th>
              <th className="px-4 py-3 text-center">위험도</th>
              <th className="px-4 py-3 text-center">신뢰도</th>
              <th className="px-4 py-3 text-center">신호</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.slice(0, 12).map((row) => (
              <tr key={`${row.rank}-${row.ticker}`} className="border-b border-line/70 last:border-b-0">
                <td className="h-10 px-4 align-middle text-slate-500">{String(row.rank).padStart(2, "0")}</td>
                <td className="h-10 px-4 align-middle">
                  <Link href={`/stocks/${row.ticker}`} className="font-semibold text-ink hover:text-[#c2410c]">
                    {row.name}
                  </Link>
                </td>
                <td className="h-10 px-4 align-middle text-slate-500">{row.ticker}</td>
                <td className="h-10 px-4 align-middle text-slate-500">{row.market}</td>
                <td className="h-10 px-4 align-middle text-right font-medium text-ink">{row.price}</td>
                <td className={clsx("h-10 px-4 align-middle text-right font-medium", changeTone(row.changePercent))}>{row.changePercent}</td>
                <td className="h-10 px-4 align-middle text-right text-slate-700">{row.tradingValue}</td>
                <td className="h-10 px-4 align-middle text-right text-slate-700">{row.marketCap}</td>
                <td className="h-10 px-4 align-middle text-right">
                  <span className="inline-flex min-w-[72px] items-center justify-center rounded border border-[#ff5a00] bg-[#fff2e8] px-2.5 py-1 text-[12px] font-semibold text-[#c2410c]">
                    {row.score}
                  </span>
                </td>
                <td className="h-10 px-4 align-middle text-right font-medium text-ink">{row.expectedReturn}</td>
                <td className="h-10 px-4 align-middle text-center">
                  <span className={clsx("inline-flex min-w-[58px] items-center justify-center rounded border px-2 py-1 text-[12px] font-semibold", RISK_STYLES[row.riskLevel])}>
                    {row.riskLevel === "low" ? "낮음" : row.riskLevel === "medium" ? "보통" : "높음"}
                  </span>
                </td>
                <td className="h-10 px-4 align-middle text-center">
                  <span className="inline-flex min-w-[56px] items-center justify-center rounded border border-line bg-white px-2 py-1 text-[12px] font-semibold text-slate-700">
                    {row.confidence}
                  </span>
                </td>
                <td className="h-10 px-4 align-middle text-center">
                  <span className={clsx("inline-flex min-w-[58px] items-center justify-center rounded border px-2 py-1 text-[12px] font-semibold", SIGNAL_STYLES[row.signal])}>
                    {SIGNAL_LABELS[row.signal]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SidebarCard({
  title,
  accent,
  children,
  className
}: {
  title: string;
  accent: "primary" | "neutral" | "warning" | "info";
  children: ReactNode;
  className?: string;
}) {
  const accentClass =
    accent === "primary"
      ? "border-[#ffd8c2] bg-[#fff2e8] text-[#c2410c]"
      : accent === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : accent === "info"
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-line bg-slate-50 text-slate-700";

  return (
    <section className={clsx("rounded-lg border border-line bg-white", className)}>
      <header className="flex h-12 items-center justify-between border-b border-line px-4">
        <div className="flex items-center gap-2">
          <span className={clsx("inline-flex h-6 w-6 items-center justify-center rounded border text-[12px] font-semibold", accentClass)}>
            S
          </span>
          <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
        </div>
        <span className="text-xs text-slate-400">LIVE</span>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

function ControlPill({ label, value }: { label: string; value: string }) {
  return (
    <label className="grid gap-1 text-[12px]">
      <span className="font-semibold text-slate-500">{label}</span>
      <div className="flex h-9 items-center justify-between rounded border border-line bg-white px-3 text-[13px] text-ink">
        <span className="truncate">{value}</span>
        <span className="ml-2 text-slate-400">▾</span>
      </div>
    </label>
  );
}

function ActionButton({
  icon,
  label,
  tone
}: {
  icon: ReactNode;
  label: string;
  tone: "primary" | "ghost";
}) {
  return (
    <button
      type="button"
      className={clsx(
        "inline-flex h-9 items-center justify-center gap-2 rounded border px-3 text-[13px] font-semibold",
        tone === "primary"
          ? "border-[#ff5a00] bg-[#ff5a00] text-white"
          : "border-line bg-white text-slate-700 hover:border-[#ff5a00] hover:text-[#c2410c]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function KpiGrid({ metrics }: { metrics: KpiMetric[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-lg border border-line bg-white p-3">
          <p className="text-[12px] font-medium text-slate-500">{metric.label}</p>
          <p className={clsx("mt-1 text-[18px] font-semibold", toneClass(metric.tone))}>{metric.value}</p>
          {metric.delta ? <p className="mt-1 text-[12px] text-slate-500">{metric.delta}</p> : null}
        </div>
      ))}
    </div>
  );
}

function SectorList({ rows }: { rows: SectorStrengthRow[] }) {
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.sector} className="rounded-lg border border-line bg-white px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-ink">{row.sector}</p>
              <p className="mt-0.5 text-[12px] text-slate-500">강도 {row.score}</p>
            </div>
            <span className={clsx("inline-flex rounded border px-2 py-1 text-[12px] font-semibold", row.changePercent.startsWith("+") ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700")}>
              {row.changePercent}
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-[#ff5a00]" style={{ width: `${row.score}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function IssueList({ rows }: { rows: NewsItem[] }) {
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.id} className="rounded-lg border border-line bg-white px-3 py-2.5">
          <div className="flex items-start gap-2">
            <span className={clsx("inline-flex h-6 shrink-0 items-center rounded border px-2 text-[12px] font-semibold", LABEL_STYLE[row.type])}>{row.type}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ink">{row.title}</p>
              <p className="mt-1 text-[12px] text-slate-500">
                {row.relatedAsset} · {row.source} · {row.publishedAt}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function WatchlistList({ items }: { items: ScreenerPageData["watchlist"] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-ink">{item.label}</p>
            {item.subValue ? <p className="mt-0.5 text-[12px] text-slate-500">{item.subValue}</p> : null}
          </div>
          <div className="text-right">
            <p className="text-[13px] font-semibold text-ink">{item.value}</p>
            <p className={clsx("mt-0.5 text-[12px] font-medium", toneClass(item.tone))}>{item.subValue ?? "모니터링"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectorMap({ rows }: { rows: SectorStrengthRow[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => (
        <div key={row.sector} className="rounded-lg border border-line bg-slate-50 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-ink">{row.sector}</p>
              <p className="mt-0.5 text-[12px] text-slate-500">강도 {row.score}</p>
            </div>
            <span className={clsx("inline-flex rounded border px-2 py-1 text-[12px] font-semibold", row.direction === "down" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-emerald-200 bg-emerald-50 text-emerald-700")}>
              {row.changePercent}
            </span>
          </div>
          <div className="mt-3">
            <MiniSparkline values={row.sparkline} direction={row.direction} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MarketFlow({ rows, metrics }: { rows: LineSeries[]; metrics: KpiMetric[] }) {
  const allValues = rows.flatMap((row) => row.values);
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const range = Math.max(1, max - min);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-[12px] font-semibold text-slate-500">
        {rows.map((row) => (
          <span key={row.id} className="inline-flex items-center gap-1.5">
            <span className={clsx("h-2 w-2 rounded-full", seriesDot(row.tone))} />
            {row.label}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 100 100" className="h-56 w-full">
        {[20, 40, 60, 80].map((line) => (
          <line key={line} x1="0" x2="100" y1={line} y2={line} stroke="#e5e7eb" strokeWidth="0.8" />
        ))}
        {rows.map((row) => (
          <polyline
            key={row.id}
            fill="none"
            stroke={seriesStroke(row.tone)}
            strokeWidth="2.1"
            vectorEffect="non-scaling-stroke"
            points={linePoints(row.values, 100, 100, min, range)}
          />
        ))}
      </svg>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-line bg-white p-3">
            <p className="text-[12px] font-medium text-slate-500">{metric.label}</p>
            <p className={clsx("mt-1 text-[18px] font-semibold", toneClass(metric.tone))}>{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniSparkline({ values, direction }: { values: number[]; direction: SectorStrengthRow["direction"] }) {
  const min = Math.min(...values);
  const range = Math.max(1, Math.max(...values) - min);

  return (
    <svg viewBox="0 0 100 24" className="h-6 w-full">
      <polyline
        fill="none"
        stroke={direction === "down" ? "#3b82f6" : direction === "flat" ? "#94a3b8" : "#ff5a00"}
        strokeWidth="1.8"
        points={linePoints(values, 100, 24, min, range)}
      />
    </svg>
  );
}

function linePoints(values: number[], width: number, height: number, min: number, range: number) {
  return values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");
}

function seriesStroke(tone: LineSeries["tone"]) {
  if (tone === "gray") return "#94a3b8";
  if (tone === "blue") return "#3b82f6";
  if (tone === "green") return "#16a34a";
  if (tone === "red") return "#ef4444";
  return "#ff5a00";
}

function seriesDot(tone: LineSeries["tone"]) {
  if (tone === "gray") return "bg-slate-400";
  if (tone === "blue") return "bg-blue-500";
  if (tone === "green") return "bg-emerald-500";
  if (tone === "red") return "bg-red-500";
  return "bg-[#ff5a00]";
}

function toneClass(tone?: StatusTone) {
  if (tone === "positive") return "text-emerald-700";
  if (tone === "negative") return "text-red-700";
  if (tone === "warning") return "text-amber-800";
  if (tone === "info") return "text-blue-700";
  if (tone === "primary") return "text-[#c2410c]";
  return "text-ink";
}

function changeTone(value: string) {
  if (value.startsWith("+")) return "text-emerald-700";
  if (value.startsWith("-")) return "text-blue-700";
  return "text-slate-700";
}
