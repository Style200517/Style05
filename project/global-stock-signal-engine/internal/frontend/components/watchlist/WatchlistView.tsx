"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronRight, Download, Filter, Layers3, TrendingUp } from "lucide-react";
import type { LineSeries, SignalChangeRow, SignalLabel, StatusTone, WatchlistData, WatchlistRow } from "@/lib/signalflowTypes";
import { DISCLAIMER, SIGNAL_LABEL_TEXT } from "@/lib/signalflowUi";

interface WatchlistViewProps {
  data: WatchlistData;
}

export function WatchlistView({ data }: WatchlistViewProps) {
  const [controlValues, setControlValues] = useState<Record<string, string>>(() =>
    data.controls.reduce<Record<string, string>>((acc, control) => {
      acc[control.label] = control.value;
      return acc;
    }, {})
  );

  const filteredRows = useMemo(() => {
    const market = controlValues["시장"] ?? "전체";
    const signal = controlValues["신호 상태"] ?? "전체";
    const risk = controlValues["위험도"] ?? "전체";
    const alert = controlValues["알림 상태"] ?? "전체";
    const sort = controlValues["정렬"] ?? "상승 가능성 점수";

    const rows = data.rows.filter((row) => {
      const marketMatch = market === "전체" || matchesMarket(row, market);
      const signalMatch = signal === "전체" || SIGNAL_LABEL_TEXT[row.signal] === signal;
      const riskMatch = risk === "전체" || riskLabel(row.riskLevel) === risk;
      const alertMatch = alert === "전체" || row.alertStatus === alert;
      return marketMatch && signalMatch && riskMatch && alertMatch;
    });

    return [...rows].sort((left, right) => sortRows(left, right, sort));
  }, [controlValues, data.rows]);

  return (
    <main className="mx-auto w-full max-w-[1920px] px-4 pb-6 pt-4 text-[#17202a]">
      <PageTitle
        eyebrow="관심종목"
        title="관심종목 관리"
        subtitle="관심 종목의 신호, 변동률, 알림 상태를 한눈에 관리"
      />

      <ControlPanel
        controls={data.controls}
        selectedControls={controlValues}
        onControlChange={(label, value) => setControlValues((current) => ({ ...current, [label]: value }))}
        onReset={() =>
          setControlValues(
            data.controls.reduce<Record<string, string>>((acc, control) => {
              acc[control.label] = control.value;
              return acc;
            }, {})
          )
        }
      />

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_456px]">
        <Panel className="min-h-[640px]">
          <PanelHeader
            title="내 관심종목 목록"
            subtitle="신호, 위험도, 알림 상태를 기준으로 탐색"
            actions={
              <div className="flex items-center gap-2">
                <ActionButton icon={<Layers3 className="h-4 w-4" />} label="그룹 보기" />
                <ActionButton icon={<Download className="h-4 w-4" />} label="내보내기" />
              </div>
            }
          />
          <div className="overflow-x-auto border-t border-[#eceff3]">
            <table className="min-w-[1500px] w-full border-collapse text-[13px]">
              <thead className="bg-[#fafafa] text-left text-[12px] font-semibold text-[#667085]">
                <tr className="h-[38px]">
                  <Th>순위</Th>
                  <Th>종목명</Th>
                  <Th>티커</Th>
                  <Th>시장</Th>
                  <Th>현재가</Th>
                  <Th>등락률</Th>
                  <Th>상승 가능성 점수</Th>
                  <Th>기대수익률</Th>
                  <Th>위험도</Th>
                  <Th>신호</Th>
                  <Th>알림</Th>
                  <Th>메모</Th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <WatchlistRowView key={`${row.ticker}-${row.rank}`} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <aside className="grid gap-4">
          <Panel>
            <PanelHeader title="관심종목 요약" subtitle="구성 현황과 평균 신호" />
            <div className="grid grid-cols-2 gap-2 px-4 pb-4">
              {data.summary.map((metric) => (
                <MetricTile key={metric.label} label={metric.label} value={metric.value} delta={metric.delta} tone={metric.tone} />
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="알림 센터" subtitle="관심 뉴스 및 이슈 알림" />
            <div className="space-y-2 px-4 pb-4">
              {data.alerts.map((item) => (
                <AlertRow key={item.id} title={item.title} source={item.source} publishedAt={item.publishedAt} status={item.status} />
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="내 그룹" subtitle="그룹별 종목 수와 플래그" />
            <div className="space-y-2 px-4 pb-4">
              {data.groups.map((group) => (
                <GroupRow key={group.name} group={group} />
              ))}
            </div>
          </Panel>
        </aside>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <Panel>
          <PanelHeader title="관심종목 성과 추이" subtitle="평균 수익률 흐름" />
          <div className="px-4 pb-4">
            <SeriesChart series={data.performance} height={210} />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {data.performanceMetrics.map((metric) => (
                <MetricTile key={metric.label} label={metric.label} value={metric.value} delta={metric.delta} tone={metric.tone} compact />
              ))}
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="신호 변화 히스토리" subtitle="최근 상태 변화" />
          <div className="space-y-2 px-4 pb-4">
            {data.signalHistory.map((item) => (
              <SignalHistoryRow key={`${item.name}-${item.changedAt}`} item={item} />
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="우선 확인 종목" subtitle="우선순위가 높은 후보" />
          <div className="grid grid-cols-2 gap-2 px-4 pb-4">
            {data.priorityItems.map((item) => (
              <PriorityCard key={`${item.ticker}-${item.rank}`} item={item} />
            ))}
          </div>
        </Panel>
      </div>

      <p className="mt-4 text-xs leading-5 text-[#667085]">{DISCLAIMER}</p>
    </main>
  );
}

function PageTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <section className="mb-4 rounded-[8px] border border-[#e5e7eb] bg-white px-4 py-4">
      <p className="text-[12px] font-semibold tracking-[0.08em] text-[#ff5a00]">{eyebrow}</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-semibold leading-tight text-[#17202a]">{title}</h1>
          <p className="mt-2 max-w-4xl text-[14px] leading-6 text-[#4b5563]">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 rounded-[8px] border border-[#e5e7eb] bg-[#fafafa] px-3 py-2 text-[12px] text-[#667085]">
          <TrendingUp className="h-4 w-4 text-[#ff5a00]" />
          신호 추적과 알림 관리
        </div>
      </div>
    </section>
  );
}

function ControlPanel({
  controls,
  selectedControls,
  onControlChange,
  onReset
}: {
  controls: WatchlistData["controls"];
  selectedControls: Record<string, string>;
  onControlChange: (label: string, value: string) => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-[8px] border border-[#e5e7eb] bg-white px-4 py-4">
      <div className="grid gap-3 xl:grid-cols-[repeat(6,minmax(0,1fr))_auto_auto]">
        {controls.map((control) => (
          <label key={control.label} className="grid gap-1">
            <span className="text-[12px] font-semibold text-[#667085]">{control.label}</span>
            <select
              value={selectedControls[control.label] ?? control.value}
              onChange={(event) => onControlChange(control.label, event.target.value)}
              className="h-[36px] rounded-[8px] border border-[#d9e2ec] bg-white px-3 text-[13px] text-[#17202a] outline-none"
            >
              {control.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
        <div className="flex items-end gap-2">
          <ActionButton icon={<Filter className="h-4 w-4" />} label="필터 적용" />
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d9e2ec] bg-white px-3 text-[13px] font-semibold text-[#344054] transition hover:border-[#cbd5e1] hover:bg-[#fafafa]"
          >
            초기화
          </button>
        </div>
      </div>
    </section>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[8px] border border-[#e5e7eb] bg-white ${className}`}>{children}</section>;
}

function PanelHeader({
  title,
  subtitle,
  actions
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div>
        <h2 className="text-[16px] font-semibold text-[#17202a]">{title}</h2>
        {subtitle ? <p className="mt-1 text-[12px] text-[#667085]">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
  );
}

function ActionButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d9e2ec] bg-white px-3 text-[13px] font-semibold text-[#344054] transition hover:border-[#cbd5e1] hover:bg-[#fafafa]"
    >
      {icon}
      {label}
    </button>
  );
}

function MetricTile({
  label,
  value,
  delta,
  tone,
  compact = false
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: StatusTone;
  compact?: boolean;
}) {
  return (
    <div className="rounded-[8px] border border-[#e5e7eb] bg-[#fafafa] px-3 py-2">
      <p className="text-[12px] font-medium text-[#667085]">{label}</p>
      <p className={`mt-1 ${compact ? "text-[15px]" : "text-[16px]"} font-semibold ${metricTone(tone)}`}>{value}</p>
      {delta ? <p className="mt-1 text-[12px] text-[#667085]">{delta}</p> : null}
    </div>
  );
}

function metricTone(tone?: StatusTone) {
  if (tone === "positive") return "text-[#f04438]";
  if (tone === "negative") return "text-[#2563eb]";
  if (tone === "warning") return "text-[#b45309]";
  if (tone === "primary") return "text-[#ff5a00]";
  if (tone === "info") return "text-[#2563eb]";
  return "text-[#17202a]";
}

function WatchlistRowView({ row }: { row: WatchlistRow }) {
  return (
    <tr className="h-[36px] border-t border-[#eceff3] align-middle hover:bg-[#fafafa]">
      <Td className="font-semibold text-[#17202a]">{row.rank}</Td>
      <Td className="min-w-[150px]">
        <div className="font-semibold text-[#17202a]">{row.name}</div>
      </Td>
      <Td>{row.ticker}</Td>
      <Td>{row.market}</Td>
      <Td>{row.price}</Td>
      <Td className={movementClass(row.changePercent)}>{row.changePercent}</Td>
      <Td className="font-semibold text-[#17202a]">{row.score}</Td>
      <Td className={movementClass(row.expectedReturn)}>{row.expectedReturn}</Td>
      <Td>
        <span className={`inline-flex h-7 items-center rounded-[8px] border px-2 text-[12px] font-semibold ${riskClass(row.riskLevel)}`}>
          {riskLabel(row.riskLevel)}
        </span>
      </Td>
      <Td>
        <span className={`inline-flex h-7 items-center rounded-[8px] border px-2 text-[12px] font-semibold ${signalClass(row.signal)}`}>
          {SIGNAL_LABEL_TEXT[row.signal]}
        </span>
      </Td>
      <Td>
        <span className={`inline-flex h-7 items-center rounded-[8px] border px-2 text-[12px] font-semibold ${alertClass(row.alertStatus)}`}>
          {row.alertStatus}
        </span>
      </Td>
      <Td className="max-w-[260px] text-[#344054]">{row.memo}</Td>
    </tr>
  );
}

function AlertRow({ title, source, publishedAt, status }: { title: string; source: string; publishedAt: string; status: string }) {
  return (
    <div className="rounded-[8px] border border-[#eceff3] bg-[#fafafa] px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-[#17202a]">{title}</p>
          <p className="mt-1 text-[12px] text-[#667085]">
            {source} · {publishedAt}
          </p>
        </div>
        <span className={`inline-flex h-7 shrink-0 items-center rounded-[8px] border px-2 text-[12px] font-semibold ${alertClass(status)}`}>{status}</span>
      </div>
    </div>
  );
}

function GroupRow({
  group
}: {
  group: WatchlistData["groups"][number];
}) {
  return (
    <div className="rounded-[8px] border border-[#eceff3] bg-[#fafafa] px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#17202a]">{group.name}</p>
          <p className="mt-1 text-[12px] text-[#667085]">
            종목 {group.count} · 강한 관찰 {group.strong} · 주의 {group.risk}
          </p>
        </div>
        <span className="inline-flex h-7 items-center rounded-[8px] border border-[#d8dee8] bg-[#f8fafc] px-2 text-[12px] font-semibold text-[#475467]">
          알림 {group.alerts}
        </span>
      </div>
    </div>
  );
}

function SignalHistoryRow({ item }: { item: SignalChangeRow }) {
  return (
    <div className="rounded-[8px] border border-[#eceff3] bg-[#fafafa] px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#17202a]">{item.name}</p>
          <p className="mt-1 text-[12px] text-[#667085]">
            {item.changedAt} · {item.reason}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-7 items-center rounded-[8px] border px-2 text-[12px] font-semibold ${signalClass(item.previousSignal)}`}>
            {SIGNAL_LABEL_TEXT[item.previousSignal]}
          </span>
          <ChevronRight className="h-4 w-4 text-[#98a2b3]" />
          <span className={`inline-flex h-7 items-center rounded-[8px] border px-2 text-[12px] font-semibold ${signalClass(item.currentSignal)}`}>
            {SIGNAL_LABEL_TEXT[item.currentSignal]}
          </span>
        </div>
      </div>
    </div>
  );
}

function PriorityCard({
  item
}: {
  item: WatchlistData["priorityItems"][number];
}) {
  return (
    <div className="rounded-[8px] border border-[#eceff3] bg-[#fafafa] px-3 py-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-semibold text-[#667085]">우선 {item.rank}</p>
          <p className="mt-1 text-[13px] font-semibold text-[#17202a]">{item.name}</p>
          <p className="mt-1 text-[12px] text-[#667085]">{item.ticker}</p>
        </div>
        <span className={`inline-flex h-7 items-center rounded-[8px] border px-2 text-[12px] font-semibold ${signalClass(item.signal)}`}>
          {SIGNAL_LABEL_TEXT[item.signal]}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-[12px]">
        <span className="font-semibold text-[#17202a]">{item.score}</span>
        <span className={movementClass(item.changePercent)}>{item.changePercent}</span>
      </div>
      <p className="mt-2 text-[12px] leading-5 text-[#344054]">{item.memo}</p>
    </div>
  );
}

function SeriesChart({ series, height }: { series: LineSeries[]; height: number }) {
  const chart = useMemo(() => buildChart(series), [series]);
  return (
    <div style={{ height }}>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {chart.grid.map((line) => (
          <line key={line} x1="6" y1={line} x2="94" y2={line} stroke="#eceff3" strokeWidth="0.8" />
        ))}
        {chart.series.map((item) => (
          <polyline
            key={item.id}
            points={item.points}
            fill="none"
            stroke={item.stroke}
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-3 text-[12px] text-[#667085]">
        {series.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: toneColor(item.tone) }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function buildChart(series: LineSeries[]) {
  const values = series.flatMap((item) => item.values);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return {
    grid: [18, 34, 50, 66, 82],
    series: series.map((item) => ({
      id: item.id,
      stroke: toneColor(item.tone),
      points: item.values
        .map((value, index) => {
          const x = (index / Math.max(1, item.values.length - 1)) * 88 + 6;
          const y = 92 - ((value - min) / Math.max(1, max - min || 1)) * 76;
          return `${x},${y}`;
        })
        .join(" ")
    }))
  };
}

function sortRows(left: WatchlistRow, right: WatchlistRow, sort: string) {
  if (sort === "등락률") {
    return numericValue(right.changePercent) - numericValue(left.changePercent);
  }
  if (sort === "위험도") {
    return riskWeight(left.riskLevel) - riskWeight(right.riskLevel);
  }
  return right.score - left.score;
}

function matchesMarket(row: WatchlistRow, market: string) {
  if (market === "국내") {
    return row.market === "KOSPI" || row.market === "KOSDAQ";
  }
  if (market === "해외") {
    return row.market !== "KOSPI" && row.market !== "KOSDAQ";
  }
  return true;
}

function signalClass(signal: SignalLabel) {
  if (signal === "strong_watch") return "border-[#ffd6c2] bg-[#fff2e8] text-[#ff5a00]";
  if (signal === "watch") return "border-[#bcd7ff] bg-[#eef5ff] text-[#2563eb]";
  if (signal === "neutral") return "border-[#e5e7eb] bg-[#f5f6f8] text-[#4b5563]";
  if (signal === "risk") return "border-[#f7b7b3] bg-[#fff0f0] text-[#f04438]";
  return "border-[#d8dee8] bg-[#f8fafc] text-[#475467]";
}

function riskClass(risk: WatchlistRow["riskLevel"]) {
  if (risk === "low") return "border-[#c8f1d5] bg-[#eaf8ef] text-[#16833a]";
  if (risk === "medium") return "border-[#ffd89a] bg-[#fff7e6] text-[#b45309]";
  return "border-[#f7b7b3] bg-[#fff0f0] text-[#f04438]";
}

function riskLabel(risk: WatchlistRow["riskLevel"]) {
  if (risk === "low") return "낮음";
  if (risk === "medium") return "보통";
  return "높음";
}

function alertClass(status: string) {
  if (status === "활성") return "border-[#c8f1d5] bg-[#eaf8ef] text-[#16833a]";
  if (status === "가격근접") return "border-[#bcd7ff] bg-[#eef5ff] text-[#2563eb]";
  if (status === "이슈발생") return "border-[#f7b7b3] bg-[#fff0f0] text-[#f04438]";
  return "border-[#d8dee8] bg-[#f8fafc] text-[#475467]";
}

function movementClass(value: string) {
  return value.startsWith("-") ? "text-[#2563eb]" : "text-[#f04438]";
}

function numericValue(value: string) {
  const cleaned = value.replace(/[%,+]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function riskWeight(risk: WatchlistRow["riskLevel"]) {
  if (risk === "low") return 0;
  if (risk === "medium") return 1;
  return 2;
}

function toneColor(tone: LineSeries["tone"]) {
  if (tone === "orange") return "#ff5a00";
  if (tone === "gray") return "#9ca3af";
  if (tone === "blue") return "#2563eb";
  if (tone === "green") return "#16833a";
  if (tone === "red") return "#f04438";
  return "#667085";
}

function Th({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}

function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-2 ${className}`}>{children}</td>;
}
