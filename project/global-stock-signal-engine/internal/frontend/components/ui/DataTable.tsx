"use client";

import clsx from "clsx";
import type { Key, ReactNode } from "react";

export interface DataTableColumn<T> {
  id: string;
  label: ReactNode;
  align?: "left" | "center" | "right";
  width?: number | string;
  render: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: keyof T | ((row: T, index: number) => Key);
  loading?: boolean;
  loadingRows?: number;
  emptyText?: ReactNode;
  error?: ReactNode;
  onRowClick?: (row: T, index: number) => void;
  className?: string;
  tableClassName?: string;
  retryAction?: {
    label: string;
    onClick: () => void;
  };
}

function resolveRowKey<T>(rowKey: keyof T | ((row: T, index: number) => Key), row: T, index: number) {
  if (typeof rowKey === "function") {
    return rowKey(row, index);
  }

  return row[rowKey] as Key;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  loadingRows = 6,
  emptyText = "표시할 데이터가 없습니다.",
  error,
  onRowClick,
  className,
  tableClassName,
  retryAction
}: DataTableProps<T>) {
  const hasRows = rows.length > 0;
  const shouldShowLoading = loading && !error;
  const shouldShowEmpty = !loading && !error && !hasRows;

  return (
    <div className={clsx("overflow-hidden rounded-[8px] border border-[var(--sf-border)] bg-white", className)}>
      <table className={clsx("sf-table", tableClassName)}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className={clsx(
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                  column.headerClassName
                )}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8">
                <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 text-center">
                  <div className="text-[14px] font-semibold text-[var(--sf-text)]">데이터를 불러오지 못했습니다.</div>
                  <div className="text-[12px] text-[var(--sf-text-secondary)]">{error}</div>
                  {retryAction ? (
                    <button
                      type="button"
                      onClick={retryAction.onClick}
                      className="sf-button h-8 rounded-md border border-[var(--sf-border)] bg-white px-3 text-[13px] font-semibold text-[var(--sf-text)] hover:border-[var(--sf-accent)] hover:text-[var(--sf-accent)]"
                    >
                      {retryAction.label}
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ) : shouldShowLoading ? (
            Array.from({ length: loadingRows }).map((_, rowIndex) => (
              <tr key={`loading-${rowIndex}`} className="animate-pulse">
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={clsx(
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right"
                    )}
                  >
                    <div
                      className={clsx(
                        "my-2 h-3 rounded bg-[var(--sf-muted-chip)]",
                        column.align === "right" && "ml-auto",
                        column.align === "center" && "mx-auto",
                        column.id === columns[0]?.id ? "w-12" : "w-20"
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : shouldShowEmpty ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8">
                <div className="flex min-h-[120px] items-center justify-center text-[13px] text-[var(--sf-text-secondary)]">
                  {emptyText}
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => {
              const key = resolveRowKey(rowKey, row, rowIndex);

              return (
                <tr
                  key={key}
                  className={clsx(onRowClick && "cursor-pointer")}
                  onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={clsx(
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                        column.className
                      )}
                      style={column.width ? { width: column.width } : undefined}
                    >
                      {column.render(row, rowIndex)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
