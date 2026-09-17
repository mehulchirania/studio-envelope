"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Progressive enhancement: server-rendered content stays visible without JavaScript. */
export default function RevealOnScroll({ children, className, delay = 0, from = "up" }: { children: ReactNode; className?: string; delay?: number; from?: "up" | "down" | "none" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || preference.matches || !("IntersectionObserver" in window)) return;
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.classList.remove("reveal-pending");
      animation = element.animate([
        { opacity: 0, transform: `translateY(${from === "none" ? 0 : from === "down" ? -24 : 32}px)` },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 850, delay: delay * 1000, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" });
      observer.unobserve(element);
    }, { threshold: 0.08 });
    if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add("reveal-pending");
    observer.observe(element);
    const restore = () => { if (preference.matches) { animation?.cancel(); element.classList.remove("reveal-pending"); observer.disconnect(); } };
    preference.addEventListener("change", restore);
    return () => { observer.disconnect(); animation?.cancel(); element.classList.remove("reveal-pending"); preference.removeEventListener("change", restore); };
  }, [delay, from]);
  return <div ref={ref} className={className}>{children}</div>;
}
