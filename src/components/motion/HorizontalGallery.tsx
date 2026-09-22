"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

type HorizontalGalleryProps = {
  items: ReactNode[];
  className?: string;
};

/** On lg+ screens: a tall sticky-pinned section that translates a row of
 * items horizontally as the visitor scrolls vertically through it. On
 * smaller screens (and reduced motion) it falls back to a plain native
 * horizontal scroll-snap row, which needs no JS pinning at all. */
export default function HorizontalGallery({ items, className }: HorizontalGalleryProps) {
  const reduced = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);

  return (
    <>
      {/* Mobile / reduced-motion: native horizontal scroll-snap, no pinning. */}
      <div className={`flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 lg:hidden ${className ?? ""}`}>
        {items.map((item, i) => (
          <div key={i} className="w-[80vw] shrink-0 snap-start sm:w-[55vw]">
            {item}
          </div>
        ))}
      </div>

      {/* Desktop: pinned horizontal scroller. */}
      {reduced ? (
        <div className={`hidden gap-3 overflow-x-auto pb-4 lg:flex ${className ?? ""}`}>
          {items.map((item, i) => (
            <div key={i} className="w-[38vw] shrink-0">
              {item}
            </div>
          ))}
        </div>
      ) : (
        <div ref={wrapperRef} className="relative hidden lg:block" style={{ height: `${items.length * 55}vh` }}>
          <div className="sticky top-0 flex h-screen items-center overflow-hidden">
            <motion.div className={`flex gap-6 ${className ?? ""}`} style={{ x }}>
              {items.map((item, i) => (
                <div key={i} className="w-[38vw] shrink-0">
                  {item}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}
