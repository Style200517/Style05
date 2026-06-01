import type { Confidence } from "@/lib/types";

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const className =
    confidence === "A"
      ? "border-teal-300 bg-teal-50 text-teal-800"
      : confidence === "B"
        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
        : confidence === "C"
          ? "border-amber-300 bg-amber-50 text-amber-800"
          : "border-red-300 bg-red-50 text-red-800";

  return (
    <span className={`inline-flex h-7 items-center rounded border px-2 text-xs font-semibold ${className}`}>
      신뢰도 {confidence}
    </span>
  );
}

