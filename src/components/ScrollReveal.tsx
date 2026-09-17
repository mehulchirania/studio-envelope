"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Site-wide scroll reveal. Tags elements matching the selectors below with
 * `data-reveal` and adds `is-revealed` once they enter the viewport; the
 * animation itself lives in globals.css. Siblings get a `--reveal-i` index so
 * they stagger. Content stays visible without JS or with reduced motion,
 * because the hidden state only applies under `html.reveal-ready`.
 */
const FADE_SELECTORS = [".discipline-strip > *", ".manifesto-top > *", ".footer-invitation > div", ".footer-bottom"];
const IMAGE_SELECTORS = [".project-tile-image", ".manifesto-photo"];

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const root = document.documentElement;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    const tag = (el: Element, kind: "fade" | "image") => {
      if (el.classList.contains("is-revealed")) return;
      if (!el.hasAttribute("data-reveal")) {
        el.setAttribute("data-reveal", kind);
        if (kind === "fade" && el.parentElement) {
          const index = Array.from(el.parentElement.children).indexOf(el);
          (el as HTMLElement).style.setProperty("--reveal-i", String(Math.min(index, 6)));
        }
      }
      // Re-observing is a no-op; this also re-arms persistent layout elements after navigation.
      observer.observe(el);
    };

    const scan = () => {
      document.querySelectorAll(FADE_SELECTORS.join(",")).forEach((el) => tag(el, "fade"));
      document.querySelectorAll(IMAGE_SELECTORS.join(",")).forEach((el) => tag(el, "image"));
    };

    scan();
    root.classList.add("reveal-ready");

    const reduceMotion = () => { if (preference.matches) root.classList.remove("reveal-ready"); };
    preference.addEventListener("change", reduceMotion);
    // Catch elements rendered later (e.g. the project filter swapping cards).
    let frame = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      preference.removeEventListener("change", reduceMotion);
      root.classList.remove("reveal-ready");
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}

