"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type GlimpseImage = { src: string; alt: string; slug: string };

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Home page carousel: random photographs from every project, all the same size, no captions, drifting
 * left in a seamless loop. It is a native horizontal scroller (the list is rendered twice and the scroll
 * position wraps by one copy), so a finger swipe works with the browser's own momentum and a mouse can
 * drag it. Drifting pauses while the user touches, drags, hovers or focuses it, and resumes shortly after.
 * Under reduced motion it never drifts, it is just a draggable row. The order is shuffled in the browser
 * after load so server and client markup match. */
export default function WorkGlimpse({ images, limit = 14 }: { images: GlimpseImage[]; limit?: number }) {
  const [items, setItems] = useState(() => images.slice(0, limit));
  const wrapRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(shuffled(images).slice(0, limit));
  }, [images, limit]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const copy = copyRef.current;
    if (!wrap || !copy) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Roughly 4.5s per photograph keeps the drift calm (about 60s for a full cycle of 14).
    const speed = () => copy.offsetWidth / (Math.max(items.length, 4) * 4.5); // px per second
    let pos = wrap.scrollLeft;
    let last = performance.now();
    let hovering = false;
    let focused = false;
    let dragging = false;
    let lastInput = 0;
    let raf = 0;
    const input = () => {
      lastInput = performance.now();
    };

    // Both copies are identical, so jumping by one copy length is invisible. Keep the position in the
    // middle band so there is always room to move in either direction.
    const wrapPos = (value: number) => {
      const loop = copy.offsetWidth;
      if (loop <= 0 || reduced) return value;
      if (value < loop * 0.25) return value + loop;
      if (value > loop * 1.25) return value - loop;
      return value;
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      const idle = !hovering && !focused && !dragging && now - lastInput > 1500;
      if (idle && !reduced) {
        pos += speed() * dt;
      } else {
        pos = wrap.scrollLeft;
      }
      const wrapped = wrapPos(pos);
      if (idle || wrapped !== pos) {
        pos = wrapped;
        wrap.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Mouse drag. Touch is left to native scrolling (momentum, and vertical page scroll still works).
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = wrap.scrollLeft;
      input();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) moved = true;
      wrap.scrollLeft = startScroll - dx;
      input();
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      input();
    };
    // A drag must not open the project it ended on.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };
    const onFocusIn = () => {
      focused = true;
    };
    const onFocusOut = () => {
      focused = false;
    };

    wrap.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    wrap.addEventListener("click", onClick, true);
    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("focusin", onFocusIn);
    wrap.addEventListener("focusout", onFocusOut);
    wrap.addEventListener("touchstart", input, { passive: true });
    wrap.addEventListener("touchmove", input, { passive: true });
    wrap.addEventListener("touchend", input, { passive: true });
    wrap.addEventListener("wheel", input, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      wrap.removeEventListener("click", onClick, true);
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("focusin", onFocusIn);
      wrap.removeEventListener("focusout", onFocusOut);
      wrap.removeEventListener("touchstart", input);
      wrap.removeEventListener("touchmove", input);
      wrap.removeEventListener("touchend", input);
      wrap.removeEventListener("wheel", input);
    };
  }, [items.length]);

  if (images.length === 0) return null;

  return (
    <section id="work" className="band-bone overflow-hidden border-t border-hairline py-14 sm:py-20" aria-labelledby="work-glimpse">
      <style>{`
        .glimpse-wrap { overflow-x: auto; overscroll-behavior-x: contain; scrollbar-width: none; cursor: grab; user-select: none; -webkit-user-select: none; }
        .glimpse-wrap::-webkit-scrollbar { display: none; }
        .glimpse-wrap a, .glimpse-wrap img { -webkit-user-drag: none; }
        @media (prefers-reduced-motion: reduce) {
          .glimpse-copy[aria-hidden="true"] { display: none; }
        }
      `}</style>

      <div className="container-x mb-8 sm:mb-10">
        <h2 id="work-glimpse" className="font-display text-[clamp(26px,2.6vw,38px)] font-normal leading-tight text-ink">
          A glimpse of our work.
        </h2>
      </div>

      <div ref={wrapRef} className="glimpse-wrap">
        <div className="flex w-max motion-reduce:px-[max(18px,calc((100vw-1600px)/2+18px))]">
          {[false, true].map((duplicate) => (
            <ul
              key={duplicate ? "copy" : "main"}
              ref={duplicate ? undefined : copyRef}
              aria-hidden={duplicate || undefined}
              className="glimpse-copy flex shrink-0 gap-2 pr-2"
            >
              {items.map((image, index) => (
                <li key={image.src} className="w-[65vw] max-w-[340px] shrink-0 sm:w-[340px]">
                  <Link
                    href={`/projects/${image.slug}`}
                    tabIndex={duplicate ? -1 : undefined}
                    draggable={false}
                    className="relative block aspect-[4/5] overflow-hidden bg-paper-2"
                  >
                    <Image
                      src={image.src}
                      alt={duplicate ? "" : image.alt}
                      fill
                      sizes="(max-width: 640px) 65vw, 340px"
                      priority={!duplicate && index < 2}
                      draggable={false}
                      className="object-cover"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="container-x mt-8 sm:mt-10">
        <Link href="/projects" className="link-arrow label">
          View all projects <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}
