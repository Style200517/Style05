"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface GlobalSearchProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
}

export function GlobalSearch({
  value,
  defaultValue = "",
  placeholder = "검색",
  onChange,
  onSubmit,
  className
}: GlobalSearchProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const currentValue = value ?? internalValue;

  return (
    <form
      className={clsx("relative w-full max-w-[320px]", className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(currentValue.trim());
      }}
    >
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sf-text-muted)]"
      />
      <input
        type="search"
        value={currentValue}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (value === undefined) {
            setInternalValue(nextValue);
          }
          onChange?.(nextValue);
        }}
        placeholder={placeholder}
        className="h-9 w-full rounded-md border border-[var(--sf-border)] bg-white pl-9 pr-3 text-[13px] text-[var(--sf-text)] outline-none transition focus:border-[var(--sf-accent)]"
      />
    </form>
  );
}
