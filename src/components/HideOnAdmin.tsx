"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides its children on /admin routes, which render their own chrome (AdminNav)
 * instead of the public site's Header/Footer. */
export default function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
