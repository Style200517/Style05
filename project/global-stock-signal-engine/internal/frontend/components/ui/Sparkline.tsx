"use client";

import clsx from "clsx";
import type { SVGProps } from "react";

interface SparklineProps extends Omit<SVGProps<SVGSVGElement>, "data"> {
  data: number[];
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  showArea?: boolean;
}

function buildPath(data: number[], width: number, height: number) {
  if (data.length === 0) {
    return "";
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const paddingY = height * 0.12;
  const innerHeight = height - paddingY * 2;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  return data
    .map((value, index) => {
      const normalized = (value - min) / range;
      const x = index * stepX;
      const y = height - paddingY - normalized * innerHeight;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export function Sparkline({
  data,
  stroke = "var(--sf-accent)",
  fill = "rgba(255, 90, 0, 0.12)",
  strokeWidth = 1.8,
  showArea = true,
  className,
  width = 112,
  height = 32,
  ...props
}: SparklineProps) {
  const chartWidth = typeof width === "number" ? width : Number(width) || 112;
  const chartHeight = typeof height === "number" ? height : Number(height) || 32;
  const path = buildPath(data, chartWidth, chartHeight);

  if (!path) {
    return <svg aria-hidden="true" width={width} height={height} className={clsx(className)} />;
  }

  const areaPath = `${path} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      className={clsx("overflow-visible", className)}
      {...props}
    >
      {showArea ? <path d={areaPath} fill={fill} /> : null}
      <path d={path} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
