import type { SignalLabel } from "./types";

export const DISCLAIMER =
  "본 서비스는 투자 판단 보조용 리서치 도구이며 투자 손실 가능성이 존재합니다.";

export const LABEL_TEXT: Record<SignalLabel, string> = {
  strong_watch: "강한 관찰 후보",
  watch: "관찰 후보",
  neutral: "중립",
  risk: "주의",
  exclude: "제외"
};

export const LABEL_CLASS: Record<SignalLabel, string> = {
  strong_watch: "border-accent bg-teal-50 text-teal-800",
  watch: "border-emerald-300 bg-emerald-50 text-emerald-800",
  neutral: "border-slate-300 bg-slate-50 text-slate-700",
  risk: "border-caution bg-amber-50 text-amber-800",
  exclude: "border-danger bg-red-50 text-red-800"
};

