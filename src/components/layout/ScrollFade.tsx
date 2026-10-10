"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const IGNORED_TAGS = new Set(["SCRIPT", "STYLE", "TEMPLATE", "LINK", "META", "NOSCRIPT"]);

/** Backgrounds, overlays and floating UI shouldn't fade with the content. */
function isOutOfFlow(el: Element): boolean {
  const position = getComputedStyle(el).position;
  return position === "fixed" || position === "sticky" || position === "absolute";
}

function isCandidate(el: Element): boolean {
  return !IGNORED_TAGS.has(el.tagName) && !isOutOfFlow(el);
}

/** `<article>`, or a plain div that only wraps <section>s: look inside it for the real bands. */
function isWrapper(el: Element): boolean {
  if (el.tagName === "ARTICLE") return true;
  return el.tagName === "DIV" && el.children.length > 0 && Array.from(el.children).every((c) => c.tagName === "SECTION");
}

/**
 * Finds the blocks to fade. Pages are stacks of full-width colour bands, so the
 * bands themselves must stay put (fading them would flash the page background);
 * instead each band's content blocks are the targets.
 */
function collectTargets(root: Element, out: Element[]) {
  for (const band of Array.from(root.children)) {
    if (!isCandidate(band)) continue;
    if (isWrapper(band)) {
      collectTargets(band, out);
      continue;
    }
    for (const block of Array.from(band.children)) {
      if (isCandidate(block)) out.push(block);
    }
  }
}

/**
 * Subtle fade in/out as content scrolls into and out of view, on every page.
 * Content is fully visible without JavaScript and for visitors who prefer
 * reduced motion; scrolling itself stays native. Blocks already on screen when
 * the page loads are never hidden, so there's no flash.
 */
export default function ScrollFade() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tracked = new WeakSet<Element>();
    const seen: Element[] = [];

    // The slightly shrunk viewport makes blocks fade out as they near an edge, not only after leaving.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.toggleAttribute("data-in", entry.isIntersecting);
        }
      },
      { rootMargin: "-8% 0px -8% 0px", threshold: 0 }
    );

    function scan() {
      const targets: Element[] = [];
      const main = document.querySelector("main");
      if (main) collectTargets(main, targets);
      const footer = document.querySelector("body > footer");
      if (footer) {
        for (const block of Array.from(footer.children)) if (isCandidate(block)) targets.push(block);
      }

      for (const el of targets) {
        if (tracked.has(el)) continue;
        tracked.add(el);
        seen.push(el);
        const rect = el.getBoundingClientRect();
        const onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
        // Set both attributes in one go for on-screen blocks so they never visibly hide.
        el.setAttribute("data-fade", "");
        if (onScreen) el.setAttribute("data-in", "");
        observer.observe(el);
      }
    }

    scan();

    // New route content replaces <main>'s children without remounting this component.
    let frame = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    const main = document.querySelector("main");
    if (main) mutations.observe(main, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      observer.disconnect();
      for (const el of seen) {
        el.removeAttribute("data-fade");
        el.removeAttribute("data-in");
      }
    };
  }, [pathname]);

  return null;
}
