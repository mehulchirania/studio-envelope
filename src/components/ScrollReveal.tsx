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
const FADE_SELECTORS = [
  ".hero-type > *",
  ".discipline-strip > *",
  ".section-heading > *",
  ".selected-grid > *",
  ".manifesto-top > *",
  ".manifesto-grid > div > *",
  ".services-intro > *",
  ".service-list > details",
  ".journal-strip > *",
  ".footer-invitation > div",
  ".footer-bottom",
];

const IMAGE_SELECTORS = [".hero-scene", ".project-tile-image", ".manifesto-photo"];

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
