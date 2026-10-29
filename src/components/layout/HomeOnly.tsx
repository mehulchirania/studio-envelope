"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Renders its children on the home page only. */
export default function HomeOnly({ children }: { children: ReactNode }) {
  return usePathname() === "/" ? <>{children}</> : null;
}
