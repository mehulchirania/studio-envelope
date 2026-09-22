"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import RevealText from "@/components/motion/RevealText";
import type { RoomImage } from "@/lib/types";

type Slide = { image: RoomImage; room: string };

const INTERVAL_MS = 6000;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

/**
 * Full-bleed 100svh opening: James Residence photos crossfade under a slow
 * Ken Burns drift, with a night gradient for legibility under the fixed
 * transparent header. The first slide (preloaded) and headline are plain
 * markup, visible without JS; only the autoplay interval and Ken Burns scale
 * are client-only, and never run under prefers-reduced-motion.
 */
export default function Hero({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (reducedMotion) return;
    if (typeof document !== "undefined" && document.hidden) return;
    timerRef.current = setInterval(advance, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reducedMotion, advance]);

  const current = slides[index];

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-night">
      {slides.map((slide, i) => (
        <div
          key={slide.image.src}
          className="absolute inset-0 overflow-hidden transition-opacity duration-[1400ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i === index ? undefined : true}
        >
          <motion.div
            className="relative h-full w-full"
            initial={false}
            animate={reducedMotion ? { scale: 1 } : { scale: i === index ? 1.12 : 1 }}
            transition={{ duration: i === index ? INTERVAL_MS / 1000 + 1.4 : 0.8, ease: "linear" }}
          >
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              fill
              sizes="100vw"
              preload={i === 0}
              className="object-cover"
            />
          </motion.div>
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-abyss/55 via-abyss/10 to-abyss/85" />

      <div className="container-x relative z-10 flex h-full flex-col justify-between pb-10 pt-28 sm:pb-14 sm:pt-32">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="label text-mist">Architecture &amp; Interiors — Bangalore</p>
          <p className="label flex items-center gap-2 text-mist">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-marigold" aria-hidden="true" />
            Scroll
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-10">
          <h1 className="display-xl max-w-[18ch] text-bone">
            <RevealText as="span" text="Spaces, sealed with" />{" "}
            <RevealText as="span" text="care." delay={0.2} className="italic font-normal" />
          </h1>

          <div className="label shrink-0 text-mist">
            <p className="tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </p>
            <p className="mt-1 text-bone">{current.room}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
