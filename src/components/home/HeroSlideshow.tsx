"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import type { RoomImage } from "@/lib/types";

type Slide = {
  image: RoomImage;
  room: string;
};

const INTERVAL_MS = 6000;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

/** Large, contained crossfade slideshow for the home opening. Autoplays every
 * 6s, pauses on hover/focus/hidden-tab, and never autoplays under
 * prefers-reduced-motion. Content (the first image) is always visible
 * without JS. */
export default function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback((delta: number) => {
    setIndex((i) => (i + delta + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || reducedMotion) return;
    if (typeof document !== "undefined" && document.hidden) return;

    timerRef.current = setInterval(() => advance(1), INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reducedMotion, advance]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden ? true : false);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const current = slides[index];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-2 sm:aspect-[16/10]">
        {slides.map((slide, i) => (
          <div
            key={slide.image.src}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === index ? 1 : 0 }}
            aria-hidden={i === index ? undefined : true}
          >
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              width={slide.image.width}
              height={slide.image.height}
              sizes="(max-width: 640px) 100vw, 1296px"
              preload={i === 0}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          James Residence — {current.room}, Bangalore
        </p>

        <div className="flex items-center gap-4">
          <span className="label">
            {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => advance(-1)}
              aria-label="Previous image"
              className="flex h-9 w-9 items-center justify-center border border-hairline text-teal transition-colors hover:border-teal"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => advance(1)}
              aria-label="Next image"
              className="flex h-9 w-9 items-center justify-center border border-hairline text-teal transition-colors hover:border-teal"
            >
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              className="flex h-9 w-9 items-center justify-center border border-hairline text-teal transition-colors hover:border-teal"
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
