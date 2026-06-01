"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={clsx("w-full px-4 py-4", className)}>{children}</div>;
}
