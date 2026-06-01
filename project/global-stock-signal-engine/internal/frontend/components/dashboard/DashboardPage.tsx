import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";
import { BarChart3, ChevronRight, CircleDot, Layers3, LineChart, Newspaper, ShieldAlert, TrendingUp } from "lucide-react";
import type {
  CandidateRow,
  DashboardData,
  KpiMetric,
  LineSeries,
  NewsItem,
  ScoreBreakdownItem,
  SectorStrengthRow,
  SidebarListItem
} from "@/lib/signalflowTypes";

const SIGNAL_LABELS = {
  strong_watch: "강한 관찰",
  watch: "관찰",
  neutral: "중립",
  risk: "주의",
  exclude: "제외"
} as const;

const RISK_BADGE = {
  low: "border-emerald-300 bg-emerald-50 text-emerald-700",
  medium: "border-amber-300 bg-amber-50 text-amber-800",
  high: "border-red-300 bg-red-50 text-red-700"
} as const;

export function DashboardPage({ data }: { data: DashboardData }) {
  return (
    <main className="w-full px-4 py-4">
      <div className="space-y-4">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.34fr)_460px]">
          <Card title="오늘의 관찰 후보" icon={<TrendingUp className="h-4 w-4" />}>
            <CandidateTable rows={data.candidates} />
          </Card>

          <Card title="오늘의 집중 분석" icon={<LineChart className="h-4 w-4" />} className="min-h-[560px]">
            <FeaturedAnalysis data={data.featured} />
          </Card>

          <div className="space-y-4">
            <Card title="뉴스 레이더" icon={<Newspaper className="h-4 w-4" />}>
              <RadarList items={data.newsRadar} />
            </Card>
            <Card title="시장 요약" icon={<BarChart3 className="h-4 w-4" />}>
              <KpiGrid metrics={data.marketSummary} />
            </Card>
            <Card title="내 관심종목" icon={<CircleDot className="h-4 w-4" />}>
              <WatchlistList items={data.watchlist} />
            </Card>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.38fr)_minmax(0,1fr)]">
          <Card title="백테스트 성과" icon={<Layers3 className="h-4 w-4" />} className="min-h-[300px]">
            <BacktestPanel series={data.backtestSeries} metrics={data.backtestMetrics} />
          </Card>
          <Card title="섹터 강도" icon={<ShieldAlert className="h-4 w-4" />} className="min-h-[300px]">
            <SectorStrengthPanel rows={data.sectorStrength} />
          </Card>
        </section>
      </div>
    </main>
  );
}

function Card({
  title,
  icon,
  children,
  className
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("rounded-lg border border-line bg-white", className)}>
      <header className="flex h-12 items-center justify-between border-b border-line px-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded border border-[#ffd8c2] bg-[#fff2e8] text-[#c2410c]">
            {icon}
          </span>
          <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
        </div>
        <span className="text-xs text-slate-400">SignalFlow</span>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

function CandidateTable({ rows }: { rows: CandidateRow[] }) {
  return (
    <div className="overflow-hidden">
      <table className="w-full border-collapse text-[13px]">
        <thead className="text-left text-[12px] font-semibold text-slate-500">
          <tr className="border-b border-line">
            <th className="pb-3 pr-2">순위</th>
            <th className="pb-3 pr-2">종목명</th>
            <th className="pb-3 pr-2">티커</th>
            <th className="pb-3 pr-2 text-right">상승 가능성 점수</th>
            <th className="pb-3 pr-2 text-right">기대수익률</th>
            <th className="pb-3 pr-2 text-center">위험도</th>
            <th className="pb-3 text-center">신뢰도</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 10).map((row) => (
            <tr key={`${row.rank}-${row.ticker}`} className="border-b border-line/70 last:border-b-0">
              <td className="h-10 pr-2 align-middle text-slate-500">{String(row.rank).padStart(2, "0")}</td>
              <td className="h-10 pr-2 align-middle">
                <Link href={`/stocks/${row.ticker}`} className="font-semibold text-ink hover:text-[#c2410c]">
                  {row.name}
                </Link>
              </td>
              <td className="h-10 pr-2 align-middle text-slate-500">{row.ticker}</td>
              <td className="h-10 pr-2 align-middle text-right">
                <span className="inline-flex min-w-[72px] items-center justify-center rounded border border-[#ff5a00] bg-[#fff2e8] px-2.5 py-1 text-[12px] font-semibold text-[#c2410c]">
                  {row.score}
                </span>
              </td>
              <td className="h-10 pr-2 align-middle text-right font-medium text-ink">{row.expectedReturn}</td>
              <td className="h-10 px-1 align-middle text-center">
                <span className={clsx("inline-flex min-w-[60px] items-center justify-center rounded border px-2 py-1 text-[12px] font-semibold", RISK_BADGE[row.riskLevel])}>
                  {row.riskLevel === "low" ? "낮음" : row.riskLevel === "medium" ? "보통" : "높음"}
                </span>
              </td>
              <td className="h-10 pl-1 align-middle text-center">
                <span className="inline-flex min-w-[56px] items-center justify-center rounded border border-line bg-white px-2 py-1 text-[12px] font-semibold text-slate-700">
                  {row.confidence}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FeaturedAnalysis({ data }: { data: DashboardData["featured"] }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Featured stock</p>
          <h3 className="mt-1 text-[24px] font-semibold leading-tight text-ink">{data.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{data.ticker}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex h-8 items-center rounded border border-[#ff5a00] bg-[#fff2e8] px-3 text-[13px] font-semibold text-[#c2410c]">
            상승 가능성 점수 {data.score}
          </span>
          <span className="inline-flex h-8 items-center rounded border border-line bg-white px-3 text-[13px] font-semibold text-slate-700">
            신뢰도 {data.confidence}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <MetricCard label="현재가" value={data.price} />
        <MetricCard label="등락" value={data.change} caption={data.changePercent} />
        <MetricCard
          label="관찰 신호"
          value={data.score >= 80 ? SIGNAL_LABELS.strong_watch : data.score >= 70 ? SIGNAL_LABELS.watch : SIGNAL_LABELS.neutral}
          caption="가격·수급 확인"
        />
        <MetricCard label="리스크" value={data.risks[0] ?? "리스크 확인 필요"} caption={data.risks[1]} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold">
        {["일봉", "주봉", "월봉", "3개월", "1년", "3년"].map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={clsx(
              "h-8 rounded-full border px-3",
              index === 0 ? "border-[#ff5a00] bg-[#fff2e8] text-[#c2410c]" : "border-line bg-white text-slate-600"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-line bg-[#fbfcfe] p-3">
        <CandlestickChart candles={data.candles} />
      </div>

      <div className="space-y-3">
        <ScoreBreakdownBars items={data.scoreBreakdown} />
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <ReasonBox title="판단 근거" items={data.reasons} tone="positive" />
        <ReasonBox title="리스크" items={data.risks} tone="warning" />
      </div>
    </div>
  );
}

function MetricCard({ label, value, caption }: { label: string; value: string; caption?: string }) {
  return (
    <div className="rounded-lg border border-line bg-slate-50 p-3">
      <p className="text-[12px] font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-[18px] font-semibold leading-tight text-ink">{value}</p>
      {caption ? <p className="mt-1 text-[12px] text-slate-500">{caption}</p> : null}
    </div>
  );
}

function CandlestickChart({ candles }: { candles: DashboardData["featured"]["candles"] }) {
  const width = 100;
  const height = 100;
  const priceMax = Math.max(...candles.map((item) => item.high));
  const priceMin = Math.min(...candles.map((item) => item.low));
  const volumeMax = Math.max(...candles.map((item) => item.volume));
  const range = Math.max(1, priceMax - priceMin);
  const bodyWidth = 4.3;

  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
        <defs>
          <linearGradient id="featuredFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff5a00" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ff5a00" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80].map((line) => (
          <line key={line} x1="0" x2="100" y1={line} y2={line} stroke="#e5e7eb" strokeWidth="0.8" />
        ))}
        {candles.map((item, index) => {
          const x = ((index + 0.5) / candles.length) * width;
          const openY = 100 - ((item.open - priceMin) / range) * 74 - 10;
          const closeY = 100 - ((item.close - priceMin) / range) * 74 - 10;
          const highY = 100 - ((item.high - priceMin) / range) * 74 - 10;
          const lowY = 100 - ((item.low - priceMin) / range) * 74 - 10;
          const up = item.close >= item.open;
          const bodyTop = Math.min(openY, closeY);
          const bodyBottom = Math.max(openY, closeY);
          const bodyHeight = Math.max(1.5, bodyBottom - bodyTop);
          const bodyFill = up ? "#ff5a00" : "#3b82f6";

          return (
            <g key={item.date}>
              <line x1={x} x2={x} y1={highY} y2={lowY} stroke={bodyFill} strokeWidth="0.8" />
              <rect x={x - bodyWidth / 2} y={bodyTop} width={bodyWidth} height={bodyHeight} rx="0.8" fill={bodyFill} />
            </g>
          );
        })}
      </svg>

      <div className="flex items-center justify-between gap-3 text-[12px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#ff5a00]" />
            상승 봉
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
            하락 봉
          </span>
        </div>
        <div className="text-right">
          <p>거래량 기준 정렬</p>
          <p className="font-medium text-slate-700">최근 거래량 {compactVolume(candles[candles.length - 1]?.volume ?? 0)}</p>
        </div>
      </div>

      <svg viewBox="0 0 100 30" className="h-12 w-full">
        {candles.map((item, index) => {
          const barX = (index / Math.max(1, candles.length - 1)) * 100;
          const barHeight = (item.volume / Math.max(1, volumeMax)) * 22;
          return <rect key={`${item.date}-vol`} x={barX - 1.8} y={26 - barHeight} width="3.6" height={barHeight} rx="0.6" fill="#d9e2ec" />;
        })}
      </svg>
    </div>
  );
}

function ScoreBreakdownBars({ items }: { items: ScoreBreakdownItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="grid grid-cols-[120px_minmax(0,1fr)_56px] items-center gap-3">
          <span className="text-[12px] font-medium text-slate-600">{item.label}</span>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-[#ff5a00]" style={{ width: `${(item.value / Math.max(1, item.max)) * 100}%` }} />
          </div>
          <span className="text-right text-[12px] font-semibold text-slate-700">
            {item.value}/{item.max}
          </span>
        </div>
      ))}
    </div>
  );
}

function ReasonBox({ title, items, tone }: { title: string; items: string[]; tone: "positive" | "warning" }) {
  return (
    <div className={clsx("rounded-lg border p-3", tone === "positive" ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/70")}>
      <p className="text-[12px] font-semibold text-slate-700">{title}</p>
      <ul className="mt-2 space-y-1.5 text-[13px] leading-5 text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RadarList({ items }: { items: NewsItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border border-line px-3 py-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-2">
              <NewsTypeBadge type={item.type} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-[12px] text-slate-500">
                  {item.relatedAsset} · {item.source} · {item.publishedAt}
                </p>
              </div>
            </div>
            <span className="inline-flex shrink-0 rounded border border-line bg-white px-2 py-1 text-[12px] font-semibold text-slate-600">
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function NewsTypeBadge({ type }: { type: NewsItem["type"] }) {
  const className =
    type === "호재"
      ? "border-[#ffd0bc] bg-[#fff2e8] text-[#c2410c]"
      : type === "악재"
        ? "border-red-200 bg-red-50 text-red-700"
        : type === "공시"
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : type === "수급"
            ? "border-violet-200 bg-violet-50 text-violet-700"
            : type === "실적"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : type === "매크로"
                ? "border-slate-200 bg-slate-50 text-slate-700"
                : type === "가격"
                  ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                  : type === "이슈"
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : type === "확인"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span className={clsx("inline-flex h-6 shrink-0 items-center rounded border px-2 text-[12px] font-semibold", className)}>{type}</span>
  );
}

function KpiGrid({ metrics }: { metrics: KpiMetric[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-lg border border-line bg-slate-50 p-3">
          <p className="text-[12px] font-medium text-slate-500">{metric.label}</p>
          <p className={clsx("mt-1 text-[18px] font-semibold", metricTone(metric.tone))}>{metric.value}</p>
          {metric.delta ? <p className="mt-1 text-[12px] text-slate-500">{metric.delta}</p> : null}
        </div>
      ))}
    </div>
  );
}

function metricTone(tone?: KpiMetric["tone"]) {
  if (tone === "positive") return "text-emerald-700";
  if (tone === "negative") return "text-red-700";
  if (tone === "warning") return "text-amber-800";
  if (tone === "info") return "text-blue-700";
  if (tone === "primary") return "text-[#c2410c]";
  return "text-ink";
}

function WatchlistList({ items }: { items: SidebarListItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-ink">{item.label}</p>
            {item.subValue ? <p className="mt-0.5 text-[12px] text-slate-500">{item.subValue}</p> : null}
          </div>
          <div className="text-right">
            <p className="text-[13px] font-semibold text-ink">{item.value}</p>
            <p className={clsx("mt-0.5 text-[12px] font-medium", watchTone(item.tone))}>{item.subValue ?? "모니터링"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function watchTone(tone?: SidebarListItem["tone"]) {
  if (tone === "positive") return "text-emerald-700";
  if (tone === "negative") return "text-red-700";
  if (tone === "warning") return "text-amber-800";
  if (tone === "info") return "text-blue-700";
  return "text-slate-500";
}

function BacktestPanel({ series, metrics }: { series: LineSeries[]; metrics: KpiMetric[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_320px]">
      <div className="rounded-lg border border-line bg-[#fbfcfe] p-3">
        <SeriesChart series={series} />
      </div>
      <div className="space-y-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-line bg-slate-50 p-3">
            <p className="text-[12px] font-medium text-slate-500">{metric.label}</p>
            <p className={clsx("mt-1 text-[19px] font-semibold", metricTone(metric.tone))}>{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeriesChart({ series }: { series: LineSeries[] }) {
  const width = 100;
  const height = 100;
  const allValues = series.flatMap((item) => item.values);
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const range = Math.max(1, max - min);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 text-[12px] font-semibold text-slate-500">
        {series.map((item) => (
          <span key={item.id} className="inline-flex items-center gap-1.5">
            <span className={clsx("h-2 w-2 rounded-full", seriesToneDot(item.tone))} />
            {item.label}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
        {[20, 40, 60, 80].map((line) => (
          <line key={line} x1="0" x2="100" y1={line} y2={line} stroke="#e5e7eb" strokeWidth="0.8" />
        ))}
        {series.map((item) => (
          <polyline
            key={item.id}
            fill="none"
            stroke={seriesStroke(item.tone)}
            strokeWidth="2.1"
            vectorEffect="non-scaling-stroke"
            points={seriesPoints(item.values, width, height, min, range)}
          />
        ))}
      </svg>
    </div>
  );
}

function SectorStrengthPanel({ rows }: { rows: SectorStrengthRow[] }) {
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.sector} className="rounded-lg border border-line px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-ink">{row.sector}</p>
              <p className="mt-0.5 text-[12px] text-slate-500">섹터 강도 {row.score}</p>
            </div>
            <span className={clsx("inline-flex rounded border px-2 py-1 text-[12px] font-semibold", row.changePercent.startsWith("+") ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700")}>
              {row.changePercent}
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-[#ff5a00]" style={{ width: `${row.score}%` }} />
          </div>
          <div className="mt-2">
            <MiniSparkline values={row.sparkline} direction={row.direction} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniSparkline({ values, direction }: { values: number[]; direction: SectorStrengthRow["direction"] }) {
  return (
    <svg viewBox="0 0 100 24" className="h-6 w-full">
      <polyline
        fill="none"
        stroke={direction === "down" ? "#3b82f6" : direction === "flat" ? "#94a3b8" : "#ff5a00"}
        strokeWidth="1.8"
        points={seriesPoints(values, 100, 24, Math.min(...values), Math.max(1, Math.max(...values) - Math.min(...values)))}
      />
    </svg>
  );
}

function seriesPoints(values: number[], width: number, height: number, min: number, range: number) {
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

function seriesToneDot(tone: LineSeries["tone"]) {
  if (tone === "gray") return "bg-slate-400";
  if (tone === "blue") return "bg-blue-500";
  if (tone === "green") return "bg-emerald-500";
  if (tone === "red") return "bg-red-500";
  return "bg-[#ff5a00]";
}

function compactVolume(value: number) {
  return new Intl.NumberFormat("ko-KR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}
