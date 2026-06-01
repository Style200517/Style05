import type { RiskLevel, SignalLabel, StatusTone } from "./signalflowTypes";

export const DISCLAIMER =
  "본 서비스는 투자 판단 보조용 리서치 도구이며 투자 손실 가능성이 존재합니다.";

export const SIGNAL_LABEL_TEXT: Record<SignalLabel, string> = {
  strong_watch: "강한 관찰",
  watch: "관찰",
  neutral: "중립",
  risk: "주의",
  exclude: "제외"
};

export const RISK_LABEL_TEXT: Record<RiskLevel, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음"
};

export const TONE_TEXT_CLASS: Record<StatusTone, string> = {
  primary: "text-[#ff5a00]",
  positive: "text-[#f04438]",
  negative: "text-[#2563eb]",
  warning: "text-[#b45309]",
  neutral: "text-[#111827]",
  info: "text-[#2563eb]"
};

export const TONE_BADGE_CLASS: Record<StatusTone, string> = {
  primary: "border-[#ff5a00] bg-[#fff2e8] text-[#ff5a00]",
  positive: "border-[#b7ebc7] bg-[#eaf8ef] text-[#16833a]",
  negative: "border-[#ffd3d3] bg-[#fff0f0] text-[#f04438]",
  warning: "border-[#ffd89a] bg-[#fff7e6] text-[#b45309]",
  neutral: "border-[#e5e7eb] bg-[#f5f6f8] text-[#4b5563]",
  info: "border-[#bcd7ff] bg-[#eef5ff] text-[#2563eb]"
};

export function movementToneClass(value: string): string {
  return value.trim().startsWith("-") ? "text-[#2563eb]" : "text-[#ff3b30]";
}

export function normalizeSignalLabel(label: SignalLabel | string): SignalLabel {
  if (label === "strong_watch" || label === "watch" || label === "neutral" || label === "risk" || label === "exclude") {
    return label;
  }
  return "neutral";
}

