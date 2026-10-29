"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type CarouselSlide = {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind?: "photo" | "render";
};

type ProjectCarouselProps = {
  slides: CarouselSlide[];
  href: string;
  title: string;
  priority?: boolean;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** One image at a time in a fixed 3:2 frame. Native scroll-snap track (swipe on
 * touch), arrow buttons and a counter kept in sync with scroll. No autoplay. */
export default function ProjectCarousel({ slides, href, title, priority }: ProjectCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    setIndex((prev) => (prev === next ? prev : Math.min(Math.max(next, 0), total - 1)));
  }, [total]);

  const goTo = (target: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = (target + total) % total;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: clamped * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={`${title} images`}>
      <div className="relative aspect-[3/2] overflow-hidden bg-paper-2">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}`}
              className="relative h-full w-full shrink-0 snap-center"
            >
              <Link href={href} tabIndex={i === index ? 0 : -1} aria-label={`View project: ${title}`} className="block h-full w-full">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  width={slide.width}
                  height={slide.height}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority={priority && i === 0}
                  loading={i === 0 && priority ? undefined : "lazy"}
                  className="h-full w-full object-cover"
                />
              </Link>
              {slide.kind === "render" && (
                <span className="label pointer-events-none absolute bottom-3 left-3 bg-bone/80 px-2.5 py-1 text-ink">
                  Visualisation
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="mt-3 flex items-center justify-between">
          <p className="label tabular-nums" aria-live="polite">
            <span className="text-brand">{pad(index + 1)}</span> / {pad(total)}
          </p>
          <div className="flex">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label={`Previous image of ${title}`}
              className="flex h-11 w-11 items-center justify-center border border-hairline text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label={`Next image of ${title}`}
              className="-ml-px flex h-11 w-11 items-center justify-center border border-hairline text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
