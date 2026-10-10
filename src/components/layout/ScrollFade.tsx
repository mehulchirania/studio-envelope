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

/** Full-width colour bands (`band-dark`, `band-bone`, ...) must never fade themselves, or the page background would flash through. */
function isBand(el: Element): boolean {
  return /(^|\s)band-/.test(el.getAttribute("class") ?? "");
}

/** Something to look inside for the real bands: an `<article>`, or an element that wraps sections or bands. */
function isWrapper(el: Element): boolean {
  if (el.tagName === "ARTICLE") return true;
  const children = Array.from(el.children).filter((c) => !IGNORED_TAGS.has(c.tagName));
  return el.tagName === "DIV" && children.length > 0 && children.some((c) => c.tagName === "SECTION" || isBand(c));
}

const MAX_SPLIT_DEPTH = 3;

/** A block taller than the screen (a long list of cards, a room with many photos) fades piece by piece instead of all at once. */
function addBlock(block: Element, out: Element[], depth = 0) {
  const parts = Array.from(block.children).filter(isCandidate);
  if (depth < MAX_SPLIT_DEPTH && parts.length >= 2 && block.getBoundingClientRect().height > window.innerHeight * 0.9) {
    for (const part of parts) addBlock(part, out, depth + 1);
  } else {
    out.push(block);
  }
}

/**
 * Finds the blocks to fade. Pages are stacks of full-width colour bands, so the
 * bands themselves stay put; each band's content blocks are the targets.
 */
function collectTargets(root: Element, out: Element[]) {
  for (const el of Array.from(root.children)) {
    if (!isCandidate(el)) continue;
    if (isBand(el) || isWrapper(el)) collectTargets(el, out);
    else addBlock(el, out);
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
      if (footer) collectTargets(footer, targets);

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
