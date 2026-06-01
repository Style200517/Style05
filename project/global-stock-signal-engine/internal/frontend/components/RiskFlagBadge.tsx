export function RiskFlagBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-800">
      {label}
    </span>
  );
}

