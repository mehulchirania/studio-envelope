"use client";
import { ReactLenis } from "lenis/react";
import { useSyncExternalStore, type ReactNode } from "react";
const query = "(prefers-reduced-motion: reduce)";
function subscribe(callback: () => void) { const media = window.matchMedia(query); media.addEventListener("change", callback); return () => media.removeEventListener("change", callback); }
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => true);
  return <ReactLenis root options={{ smoothWheel: !reduced, lerp: reduced ? 1 : 0.1, duration: reduced ? 0 : 1.1, anchors: true, autoRaf: true }}>{children}</ReactLenis>;
}
