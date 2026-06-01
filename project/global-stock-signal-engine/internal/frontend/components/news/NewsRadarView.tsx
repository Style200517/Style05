"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronRight, Download, Filter, Layers3, Radar, SlidersHorizontal } from "lucide-react";
import type { KpiMetric, NewsItem, NewsRadarData, NewsType, SectorStrengthRow, StatusTone } from "@/lib/signalflowTypes";
import { DISCLAIMER } from "@/lib/signalflowUi";

const KNOWN_NEWS_TYPES = new Set<NewsType>(["호재", "악재", "공시", "수급", "실적", "매크로", "가격", "이슈", "확인", "관찰"]);

const TYPE_BADGE_CLASS: Record<NewsType, string> = {
  호재: "border-[#ffd6c2] bg-[#fff2e8] text-[#ff5a00]",
  악재: "border-[#f7b7b3] bg-[#fff0f0] text-[#f04438]",
  공시: "border-[#bcd7ff] bg-[#eef5ff] text-[#2563eb]",
  수급: "border-[#dccdff] bg-[#f3eeff] text-[#7c3aed]",
  실적: "border-[#c8f1d5] bg-[#eaf8ef] text-[#16833a]",
  매크로: "border-[#d8dee8] bg-[#f8fafc] text-[#475467]",
  가격: "border-[#dccdff] bg-[#f3eeff] text-[#7c3aed]",
  이슈: "border-[#ffe1a6] bg-[#fff7e6] text-[#b45309]",
  확인: "border-[#bcd7ff] bg-[#eef5ff] text-[#2563eb]",
  관찰: "border-[#e5e7eb] bg-[#f5f6f8] text-[#4b5563]"
};

const STATUS_BADGE_CLASS: Record<NewsItem["status"], string> = {
  주목: "border-[#ffd6c2] bg-[#fff2e8] text-[#ff5a00]",
  관찰: "border-[#bcd7ff] bg-[#eef5ff] text-[#2563eb]",
  경계: "border-[#f7b7b3] bg-[#fff0f0] text-[#f04438]",
  확인: "border-[#d8dee8] bg-[#f8fafc] text-[#475467]",
  중립: "border-[#e5e7eb] bg-[#f5f6f8] text-[#4b5563]"
};

interface NewsRadarViewProps {
  data: NewsRadarData;
}

export function NewsRadarView({ data }: NewsRadarViewProps) {
  const [selectedTheme, setSelectedTheme] = useState(data.filters.themePills[0]?.label ?? "전체");
  const [controlValues, setControlValues] = useState<Record<string, string>>(() =>
    data.filters.controls.reduce<Record<string, string>>((acc, control) => {
      acc[control.label] = control.value;
      return acc;
    }, {})
  );

  const filteredRows = useMemo(() => {
    return data.rows.filter((row) => matchesTheme(row, selectedTheme)).slice(0, 12);
  }, [data.rows, selectedTheme]);

  const selectedMetrics = data.summary;

  return (
    <main className="mx-auto w-full max-w-[1920px] px-4 pb-6 pt-4 text-[#17202a]">
      <PageTitle
        eyebrow="뉴스 레이더"
        title="뉴스레이더"
        subtitle="시장에 영향을 주는 실시간 뉴스와 이벤트를 빠르게 탐색"
      />

      <ControlPanel
        themePills={data.filters.themePills}
        controls={data.filters.controls}
        selectedTheme={selectedTheme}
        selectedControls={controlValues}
        onThemeChange={setSelectedTheme}
        onControlChange={(label, value) => setControlValues((current) => ({ ...current, [label]: value }))}
        onReset={() => {
          setSelectedTheme(data.filters.themePills[0]?.label ?? "전체");
          setControlValues(
            data.filters.controls.reduce<Record<string, string>>((acc, control) => {
              acc[control.label] = control.value;
              return acc;
            }, {})
          );
        }}
      />

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_456px]">
        <Panel className="min-h-[644px]">
          <PanelHeader
            title="뉴스레이더 피드"
            subtitle="실시간 뉴스, 공시, 수급, 매크로 이벤트를 함께 확인"
            actions={
              <div className="flex items-center gap-2">
                <ActionButton icon={<SlidersHorizontal className="h-4 w-4" />} label="뷰 설정" />
                <ActionButton icon={<Download className="h-4 w-4" />} label="내보내기" />
              </div>
            }
          />
          <div className="border-t border-[#eceff3]">
            <div className="overflow-x-auto">
              <table className="min-w-[1380px] w-full border-collapse text-sm">
                <thead className="bg-[#fafafa] text-left text-[12px] font-semibold text-[#667085]">
                  <tr className="h-[38px]">
                    <Th>유형</Th>
                    <Th>제목</Th>
                    <Th>관련 종목</Th>
                    <Th>시장</Th>
                    <Th>영향도</Th>
                    <Th>출처</Th>
                    <Th>게시 시각</Th>
                    <Th>상태</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <NewsRow key={row.id} item={row} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Panel>

        <aside className="grid gap-4">
          <Panel>
            <PanelHeader title="뉴스 요약" subtitle="최근 이슈 흐름을 한눈에 확인" />
            <div className="grid grid-cols-2 gap-2">
              {selectedMetrics.map((metric) => (
                <MetricTile key={metric.label} metric={metric} />
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="이슈 클러스터 TOP 5" subtitle="시장 반응이 큰 클러스터 중심" />
            <div className="space-y-2">
              {data.clusters.map((cluster) => (
                <ClusterRow key={cluster.sector} row={cluster} />
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="실시간 알림" subtitle="모니터링이 필요한 최근 알림" />
            <div className="space-y-2">
              {data.alerts.map((item) => (
                <CompactNewsRow key={item.id} item={item} />
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="내 관심 뉴스" subtitle="관심 종목 연관 이슈" />
            <div className="space-y-2">
              {data.interestNews.map((item) => (
                <CompactNewsRow key={item.id} item={item} />
              ))}
            </div>
          </Panel>
        </aside>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel>
          <PanelHeader title="이슈 맵" subtitle="클러스터 분포와 강도를 요약" />
          <div className="space-y-2">
            {data.issueMap.map((row) => (
              <IssueMapRow key={row.sector} row={row} />
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="뉴스 흐름" subtitle="호재·악재·전략 점수의 방향성" />
          <SeriesChart series={data.newsFlow} height={230} />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {data.flowMetrics.map((metric) => (
              <MetricTile key={metric.label} metric={metric} compact />
            ))}
          </div>
        </Panel>
      </div>

      <p className="mt-4 text-xs leading-5 text-[#667085]">{DISCLAIMER}</p>
    </main>
  );
}

function matchesTheme(row: NewsItem, selectedTheme: string): boolean {
  if (!selectedTheme || selectedTheme === "전체" || selectedTheme === "+ 키워드 추가") {
    return true;
  }
  if (KNOWN_NEWS_TYPES.has(selectedTheme as NewsType)) {
    return row.type === selectedTheme;
  }
  return [row.title, row.relatedAsset, row.source, row.market].some((value) => value.includes(selectedTheme));
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
          <Radar className="h-4 w-4 text-[#ff5a00]" />
          실시간 피드
        </div>
      </div>
    </section>
  );
}

function ControlPanel({
  themePills,
  controls,
  selectedTheme,
  selectedControls,
  onThemeChange,
  onControlChange,
  onReset
}: {
  themePills: Array<{ label: string; active?: boolean }>;
  controls: NewsRadarData["filters"]["controls"];
  selectedTheme: string;
  selectedControls: Record<string, string>;
  onThemeChange: (value: string) => void;
  onControlChange: (label: string, value: string) => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-[8px] border border-[#e5e7eb] bg-white px-4 py-4">
      <div className="flex flex-wrap items-start gap-3">
        <p className="mt-2 min-w-[80px] text-[13px] font-semibold text-[#344054]">이슈 유형</p>
        <div className="flex flex-1 flex-wrap gap-2">
          {themePills.map((pill) => (
            <FilterPill key={pill.label} label={pill.label} active={selectedTheme === pill.label} onClick={() => onThemeChange(pill.label)} />
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3 border-t border-[#eceff3] pt-3">
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
          <ActionButton icon={<Filter className="h-4 w-4" />} label="검색/필터 적용" />
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

function FilterPill({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
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

function Th({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}

function NewsRow({ item }: { item: NewsItem }) {
  return (
    <tr className="h-[36px] border-t border-[#eceff3] align-middle hover:bg-[#fafafa]">
      <Td>
        <span className={`inline-flex h-7 items-center rounded-[8px] border px-2 text-[12px] font-semibold ${TYPE_BADGE_CLASS[item.type]}`}>
          {item.type}
        </span>
      </Td>
      <Td className="max-w-[520px]">
        <div className="truncate text-[13px] font-medium text-[#17202a]">{item.title}</div>
      </Td>
      <Td className="text-[13px] text-[#344054]">{item.relatedAsset}</Td>
      <Td className="text-[13px] text-[#344054]">{item.market}</Td>
      <Td>
        <span className="inline-flex h-7 items-center rounded-[8px] border border-[#ffd6c2] bg-[#fff2e8] px-2 text-[12px] font-semibold text-[#ff5a00]">
          {item.impactScore}
        </span>
      </Td>
      <Td className="text-[13px] text-[#344054]">{item.source}</Td>
      <Td className="text-[13px] text-[#344054]">{item.publishedAt}</Td>
      <Td>
        <span className={`inline-flex h-7 items-center rounded-[8px] border px-2 text-[12px] font-semibold ${STATUS_BADGE_CLASS[item.status]}`}>
          {item.status}
        </span>
      </Td>
    </tr>
  );
}

function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-2 ${className}`}>{children}</td>;
}

function MetricTile({ metric, compact = false }: { metric: KpiMetric; compact?: boolean }) {
  return (
    <div className="rounded-[8px] border border-[#e5e7eb] bg-[#fafafa] px-3 py-2">
      <p className="text-[12px] font-medium text-[#667085]">{metric.label}</p>
      <p className={`${compact ? "mt-1 text-[15px]" : "mt-1 text-[16px]"} font-semibold ${metricTone(metric.tone)}`}>{metric.value}</p>
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

function CompactNewsRow({ item }: { item: NewsItem }) {
  return (
    <div className="rounded-[8px] border border-[#eceff3] bg-[#fafafa] px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-[#17202a]">{item.title}</p>
          <p className="mt-1 text-[12px] text-[#667085]">
            {item.source} · {item.publishedAt}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`inline-flex h-7 items-center rounded-[8px] border px-2 text-[12px] font-semibold ${STATUS_BADGE_CLASS[item.status]}`}>
            {item.status}
          </span>
          <ChevronRight className="h-4 w-4 text-[#98a2b3]" />
        </div>
      </div>
    </div>
  );
}

function ClusterRow({ row }: { row: SectorStrengthRow }) {
  return (
    <div className="rounded-[8px] border border-[#eceff3] px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#17202a]">{row.sector}</p>
          <p className="mt-1 text-[12px] text-[#667085]">클러스터 강도 {row.score}</p>
        </div>
        <div className="text-right">
          <p className={`text-[13px] font-semibold ${row.direction === "down" ? "text-[#2563eb]" : "text-[#f04438]"}`}>{row.changePercent}</p>
        </div>
      </div>
      <MiniSparkline values={row.sparkline} direction={row.direction} className="mt-2" />
    </div>
  );
}

function IssueMapRow({ row }: { row: SectorStrengthRow }) {
  return (
    <div className="rounded-[8px] border border-[#eceff3] px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[#17202a]">{row.sector}</p>
          <p className="mt-1 text-[12px] text-[#667085]">이슈 강도 {row.score}</p>
        </div>
        <span className={`text-[13px] font-semibold ${row.direction === "down" ? "text-[#2563eb]" : "text-[#f04438]"}`}>{row.changePercent}</span>
      </div>
    </div>
  );
}

function MiniSparkline({
  values,
  direction,
  className = ""
}: {
  values: number[];
  direction: SectorStrengthRow["direction"];
  className?: string;
}) {
  const chart = buildSeriesPath(values, 120, 36);
  return (
    <svg viewBox="0 0 120 36" className={className}>
      <polyline points={chart.points} fill="none" stroke={direction === "down" ? "#2563eb" : "#f04438"} strokeWidth="2" />
    </svg>
  );
}

function SeriesChart({ series, height }: { series: NewsRadarData["newsFlow"]; height: number }) {
  const chart = useMemo(() => buildMultiSeries(series), [series]);
  return (
    <div style={{ height }}>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {chart.grid.map((line, index) => (
          <line key={index} x1="6" y1={line} x2="94" y2={line} stroke="#eceff3" strokeWidth="0.8" />
        ))}
        {chart.series.map((item) => (
          <polyline
            key={item.id}
            points={item.points}
            fill="none"
            stroke={item.stroke}
            strokeWidth="2.1"
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

function buildSeriesPath(values: number[], width: number, height: number) {
  if (!values.length) {
    return { points: "" };
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * (width - 8) + 4;
      const y = height - ((value - min) / Math.max(1, max - min || 1)) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");
  return { points };
}

function buildMultiSeries(series: NewsRadarData["newsFlow"]) {
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

function toneColor(tone: NewsRadarData["newsFlow"][number]["tone"]) {
  if (tone === "orange") return "#ff5a00";
  if (tone === "blue") return "#2563eb";
  if (tone === "green") return "#16833a";
  if (tone === "red") return "#f04438";
  return "#667085";
}
