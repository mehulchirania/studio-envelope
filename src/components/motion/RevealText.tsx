"use client";

import { motion, useInView, type Transition } from "framer-motion";
import { useRef, type ElementType } from "react";

type RevealTextProps = {
  /** Text to split and animate. Ignored if `children` is passed instead. */
  text?: string;
  children?: string;
  /** Rendered element/tag, e.g. "h1", "p", "span". Defaults to "span". */
  as?: ElementType;
  className?: string;
  /** Stagger start offset in seconds. */
  delay?: number;
  /** "words" splits on spaces; "lines" is approximated as words that wrap
   * naturally (each word still gets its own mask, which reads as per-line
   * reveal once the browser wraps them). */
  split?: "lines" | "words";
};

const EASE: Transition["ease"] = [0.22, 1, 0.36, 1];

/** Splits a heading into words, each masked and sliding up from y:110% to
 * y:0 with a stagger, once the text scrolls into view. Uses the standalone
 * `useInView` hook (backed by its own IntersectionObserver, independent of
 * the `whileInView` prop's feature-bundle wiring) so it's reliable across
 * environments. SSR renders the full text; only the transform differs
 * pre/post-hydration, so content is never stuck invisible without JS —
 * `useInView`'s `initial` state should be considered "not yet revealed" only
 * for the transform, and prefers-reduced-motion always shows the resting
 * state immediately (see reduced-motion handling below). */
export default function RevealText({
  text,
  children,
  as: Tag = "span",
  className,
  delay = 0,
  split = "words",
}: RevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px 0px 0px" });
  const content = text ?? children ?? "";
  const words = content.split(/\s+/).filter(Boolean);

  return (
    <Tag className={className}>
      <span ref={ref} className="inline">
        {words.map((word, i) => [
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden"
            style={{ verticalAlign: "top", paddingBottom: "0.08em" }}
          >
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : undefined}
              transition={{
                duration: 0.9,
                ease: EASE,
                delay: delay + i * (split === "lines" ? 0.03 : 0.06),
              }}
            >
              {word}
            </motion.span>
          </span>,
          i < words.length - 1 ? " " : null,
        ])}
      </span>
    </Tag>
  );
}
