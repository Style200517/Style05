"use client";

import { useMemo, useState, type ReactNode } from "react";
import { BarChart3, Download, RefreshCw, SlidersHorizontal, TrendingUp } from "lucide-react";
import type { BacktestData, LineSeries, StatusTone } from "@/lib/signalflowTypes";
import { DISCLAIMER } from "@/lib/signalflowUi";

const TAB_LABELS = ["누적 수익률", "초과 수익", "드로다운"] as const;
const RESULT_BADGE_CLASS: Record<string, string> = {
  익절: "border-[#c8f1d5] bg-[#eaf8ef] text-[#16833a]",
  손절: "border-[#f7b7b3] bg-[#fff0f0] text-[#f04438]",
  보유: "border-[#e5e7eb] bg-[#f5f6f8] text-[#4b5563]",
  청산: "border-[#bcd7ff] bg-[#eef5ff] text-[#2563eb]",
  완료: "border-[#d8dee8] bg-[#f8fafc] text-[#475467]",
  실행중: "border-[#ffd89a] bg-[#fff7e6] text-[#b45309]"
};

interface BacktestViewProps {
  data: BacktestData;
}

interface SelectedBacktestSeries {
  series: LineSeries[];
  legend: LineSeries[];
}

export function BacktestView({ data }: BacktestViewProps) {
  const [activeTab, setActiveTab] = useState<(typeof TAB_LABELS)[number]>("누적 수익률");
  const [controlValues, setControlValues] = useState<Record<string, string>>(() =>
    data.controls.reduce<Record<string, string>>((acc, control) => {
      acc[control.label] = control.value;
      return acc;
    }, {})
  );

  const chartSeries = useMemo(() => selectSeriesForTab(activeTab, data), [activeTab, data]);

  return (
    <main className="mx-auto w-full max-w-[1920px] px-4 pb-6 pt-4 text-[#17202a]">
      <PageTitle
        eyebrow="백테스트"
        title="백테스트 분석"
        subtitle="전략 성과와 리스크를 과거 데이터 기준으로 검증"
      />

      <ControlPanel
        controls={data.controls}
        selectedControls={controlValues}
        onControlChange={(label, value) => setControlValues((current) => ({ ...current, [label]: value }))}
        onReset={() => {
          setControlValues(
            data.controls.reduce<Record<string, string>>((acc, control) => {
              acc[control.label] = control.value;
              return acc;
            }, {})
          );
          setActiveTab("누적 수익률");
        }}
      />

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.28fr)_minmax(0,0.9fr)_456px]">
        <Panel className="min-h-[600px]">
          <PanelHeader
            title="누적 성과"
            subtitle="전략과 벤치마크의 과거 흐름을 비교"
            actions={
              <div className="flex items-center gap-2">
                <ActionButton icon={<SlidersHorizontal className="h-4 w-4" />} label="차트 설정" />
                <ActionButton icon={<Download className="h-4 w-4" />} label="내보내기" />
              </div>
            }
          />
          <div className="border-t border-[#eceff3] px-4 pb-4">
            <div className="flex flex-wrap gap-2 py-3">
              {TAB_LABELS.map((tab) => (
                <TabButton key={tab} label={tab} active={tab === activeTab} onClick={() => setActiveTab(tab)} />
              ))}
            </div>
            <LineChart series={chartSeries.series} height={280} />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#667085]">
              <div className="flex flex-wrap gap-3">
                {chartSeries.legend.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: toneColor(item.tone) }} />
                    {item.label}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-[8px] border border-[#eceff3] bg-[#fafafa] px-3 py-2">
                <TrendingUp className="h-4 w-4 text-[#ff5a00]" />
                과거 성과는 미래 수익을 보장하지 않으며, 수수료·슬리피지 반영 기준입니다.
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="백테스트 요약" subtitle="핵심 성과 지표" />
          <div className="grid grid-cols-2 gap-2 px-4 pb-4">
            {data.summary.metrics.map((metric) => (
              <MetricTile key={metric.label} metric={metric} />
            ))}
          </div>
        </Panel>

        <aside className="grid gap-4">
          <Panel>
            <PanelHeader title="전략 구성" subtitle="전략 점수 구성 비중" />
            <div className="space-y-3 px-4 pb-4">
              {data.summary.composition.map((item) => (
                <ProgressRow key={item.label} label={item.label} value={item.value} max={item.max} />
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="백테스트 조건" subtitle="검증에 사용한 주요 조건" />
            <div className="space-y-2 px-4 pb-4">
              {data.summary.conditions.map((item) => (
                <KeyValueRow key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="최근 실행 내역" subtitle="최신 백테스트 결과" />
            <div className="space-y-2 px-4 pb-4">
              {data.summary.runHistory.map((item) => (
                <RunHistoryRow key={`${item.label}-${item.value}`} item={item} />
              ))}
            </div>
          </Panel>
        </aside>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Panel>
          <PanelHeader title="월간 수익률" subtitle="연도별 월간 누적 수익률" />
          <div className="overflow-x-auto border-t border-[#eceff3]">
            <table className="min-w-[860px] w-full border-collapse text-[13px]">
              <thead className="bg-[#fafafa] text-left text-[12px] font-semibold text-[#667085]">
                <tr className="h-[38px]">
                  <Th>연도</Th>
                  {MONTH_KEYS.map((key) => (
                    <Th key={key}>{MONTH_LABELS[key]}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.summary.monthlyReturns.map((row) => (
                  <tr key={row.year} className="h-[36px] border-t border-[#eceff3]">
                    <Td className="font-semibold text-[#17202a]">{row.year}</Td>
                    {MONTH_KEYS.map((key) => (
                      <Td key={key} className={valueToneClass(row[key])}>
                        {row[key]}
                      </Td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="연도별 성과 비교" subtitle="전략과 벤치마크의 연간 비교" />
          <div className="space-y-3 px-4 pb-4">
            {data.summary.annualSeries.map((row) => (
              <AnnualRow key={row.year} year={row.year} strategy={row.strategy} benchmark={row.benchmark} />
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="리스크 분석" subtitle="분포와 보유 특성" />
          <div className="grid grid-cols-2 gap-2 px-4 pb-4">
            {data.summary.riskMetrics.map((metric) => (
              <MetricTile key={metric.label} metric={metric} />
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="최근 체결 예시" subtitle="역사적 결과 상태" />
          <div className="overflow-x-auto border-t border-[#eceff3]">
            <table className="min-w-[860px] w-full border-collapse text-[13px]">
              <thead className="bg-[#fafafa] text-left text-[12px] font-semibold text-[#667085]">
                <tr className="h-[38px]">
                  <Th>종목</Th>
                  <Th>시장</Th>
                  <Th>진입</Th>
                  <Th>청산</Th>
                  <Th>수익률</Th>
                  <Th>보유</Th>
                  <Th>결과</Th>
                </tr>
              </thead>
              <tbody>
                {data.summary.trades.map((trade) => (
                  <tr key={`${trade.name}-${trade.entryDate}`} className="h-[36px] border-t border-[#eceff3]">
                    <Td className="font-semibold text-[#17202a]">{trade.name}</Td>
                    <Td>{trade.market}</Td>
                    <Td>{trade.entryDate}</Td>
                    <Td>{trade.exitDate}</Td>
                    <Td className={trade.returnPercent.startsWith("-") ? "text-[#2563eb]" : "text-[#f04438]"}>{trade.returnPercent}</Td>
                    <Td>{trade.holdingDays}</Td>
                    <Td>
                      <span className={`inline-flex h-7 items-center rounded-[8px] border px-2 text-[12px] font-semibold ${RESULT_BADGE_CLASS[trade.result] ?? RESULT_BADGE_CLASS.완료}`}>
                        {trade.result}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <BarChart3 className="h-4 w-4 text-[#ff5a00]" />
          과거 데이터 기반 검증
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
  controls: BacktestData["controls"];
  selectedControls: Record<string, string>;
  onControlChange: (label: string, value: string) => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-[8px] border border-[#e5e7eb] bg-white px-4 py-4">
      <div className="flex flex-wrap items-end gap-3">
        {controls.map((control) => (
          <label key={control.label} className="grid min-w-[150px] gap-1">
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
        <div className="ml-auto flex gap-2">
          <ActionButton icon={<RefreshCw className="h-4 w-4" />} label="백테스트 실행" />
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

function TabButton({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-[32px] items-center rounded-full border px-3 text-[12px] font-semibold transition",
        active ? "border-[#ff5a00] bg-[#fff2e8] text-[#ff5a00]" : "border-[#e5e7eb] bg-white text-[#344054] hover:bg-[#fafafa]"
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function MetricTile({ metric }: { metric: BacktestData["summary"]["metrics"][number] | BacktestData["summary"]["riskMetrics"][number] }) {
  return (
    <div className="rounded-[8px] border border-[#e5e7eb] bg-[#fafafa] px-3 py-2">
      <p className="text-[12px] font-medium text-[#667085]">{metric.label}</p>
      <p className={`mt-1 text-[16px] font-semibold ${metricTone(metric.tone)}`}>{metric.value}</p>
      {metric.delta ? <p className="mt-1 text-[12px] text-[#667085]">{metric.delta}</p> : null}
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

function ProgressRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="grid grid-cols-[110px_1fr_44px] items-center gap-3 text-[13px]">
      <span className="text-[#344054]">{label}</span>
      <div className="h-2 rounded-full bg-[#f5f6f8]">
        <div className="h-2 rounded-full bg-[#ff5a00]" style={{ width: `${Math.min(100, (value / Math.max(max, 1)) * 100)}%` }} />
      </div>
      <span className="text-right font-semibold text-[#17202a]">{value}</span>
    </div>
  );
}

function KeyValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[8px] border border-[#eceff3] bg-[#fafafa] px-3 py-2 text-[13px]">
      <span className="text-[#344054]">{label}</span>
      <span className="font-semibold text-[#17202a]">{value}</span>
    </div>
  );
}

function RunHistoryRow({ item }: { item: BacktestData["summary"]["runHistory"][number] }) {
  return (
    <div className="rounded-[8px] border border-[#eceff3] bg-[#fafafa] px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#17202a]">{item.label}</p>
          <p className="mt-1 text-[12px] text-[#667085]">{item.subValue}</p>
        </div>
        <span className={`inline-flex h-7 items-center rounded-[8px] border px-2 text-[12px] font-semibold ${runToneClass(item.tone)}`}>
          {item.value}
        </span>
      </div>
    </div>
  );
}

function AnnualRow({ year, strategy, benchmark }: { year: string; strategy: number; benchmark: number }) {
  const max = Math.max(strategy, benchmark, 1);
  return (
    <div className="rounded-[8px] border border-[#eceff3] px-3 py-2">
      <div className="flex items-center justify-between gap-3 text-[13px]">
        <span className="font-semibold text-[#17202a]">{year}</span>
        <span className="text-[#667085]">
          전략 {strategy.toFixed(1)}% · 벤치마크 {benchmark.toFixed(1)}%
        </span>
      </div>
      <div className="mt-2 grid gap-2">
        <div className="flex items-center gap-2">
          <span className="w-16 text-[12px] text-[#667085]">전략</span>
          <div className="h-2 flex-1 rounded-full bg-[#f5f6f8]">
            <div className="h-2 rounded-full bg-[#ff5a00]" style={{ width: `${(strategy / max) * 100}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16 text-[12px] text-[#667085]">벤치</span>
          <div className="h-2 flex-1 rounded-full bg-[#f5f6f8]">
            <div className="h-2 rounded-full bg-[#9ca3af]" style={{ width: `${(benchmark / max) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LineChart({ series, height }: { series: LineSeries[]; height: number }) {
  const chart = useMemo(() => buildMultiSeries(series), [series]);
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
    </div>
  );
}

function buildMultiSeries(series: LineSeries[]) {
  const allValues = series.flatMap((item) => item.values);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const grid = [18, 34, 50, 66, 82];
  return {
    grid,
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

function selectSeriesForTab(tab: (typeof TAB_LABELS)[number], data: BacktestData): SelectedBacktestSeries {
  if (tab === "누적 수익률") {
    return { series: data.equityCurve, legend: data.equityCurve };
  }
  if (tab === "드로다운") {
    return { series: data.drawdown, legend: data.drawdown };
  }

  const strategy = data.equityCurve[0];
  const benchmark = data.equityCurve[1];
  if (!strategy || !benchmark) {
    return { series: data.equityCurve, legend: data.equityCurve };
  }

  const excess = strategy.values.map((value, index) => value - (benchmark.values[index] ?? 0));
  const excessSeries: LineSeries[] = [
    { id: "excess", label: "초과 수익", tone: "orange", values: excess },
    { id: "zero", label: "기준선", tone: "gray", values: excess.map(() => 0) }
  ];

  return {
    series: excessSeries,
    legend: excessSeries.slice(0, 1)
  };
}

function valueToneClass(value: string) {
  return value.startsWith("-") ? "text-[#2563eb]" : value.startsWith("+") ? "text-[#f04438]" : "text-[#17202a]";
}

function toneColor(tone: LineSeries["tone"]) {
  if (tone === "orange") return "#ff5a00";
  if (tone === "gray") return "#9ca3af";
  if (tone === "blue") return "#2563eb";
  if (tone === "green") return "#16833a";
  if (tone === "red") return "#f04438";
  return "#667085";
}

function runToneClass(tone?: StatusTone) {
  if (tone === "positive") return "border-[#c8f1d5] bg-[#eaf8ef] text-[#16833a]";
  if (tone === "negative") return "border-[#f7b7b3] bg-[#fff0f0] text-[#f04438]";
  if (tone === "warning") return "border-[#ffd89a] bg-[#fff7e6] text-[#b45309]";
  if (tone === "primary") return "border-[#ffd6c2] bg-[#fff2e8] text-[#ff5a00]";
  if (tone === "info") return "border-[#bcd7ff] bg-[#eef5ff] text-[#2563eb]";
  return "border-[#e5e7eb] bg-[#f5f6f8] text-[#4b5563]";
}

const MONTH_KEYS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "total"] as const;

const MONTH_LABELS: Record<(typeof MONTH_KEYS)[number], string> = {
  jan: "1월",
  feb: "2월",
  mar: "3월",
  apr: "4월",
  may: "5월",
  jun: "6월",
  jul: "7월",
  total: "합계"
};

function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-2 ${className}`}>{children}</td>;
}

function Th({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}
