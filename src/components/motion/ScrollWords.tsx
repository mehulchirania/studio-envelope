"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

type ScrollWordsProps = {
  text: string;
  className?: string;
};

/** A paragraph whose words brighten from mist to bone opacity as it scrolls
 * through the viewport (word-by-word scroll-linked opacity, no JS
 * intersection thresholds needed). Reduced motion renders every word at full
 * (bone) opacity immediately. */
export default function ScrollWords({ text, className }: ScrollWordsProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.25"] });
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(start + 1.5 / words.length, 1);
        return (
          <Word key={`${word}-${i}`} word={word} start={start} end={end} progress={scrollYProgress} reduced={!!reduced} last={i === words.length - 1} />
        );
      })}
    </p>
  );
}

function Word({
  word,
  start,
  end,
  progress,
  reduced,
  last,
}: {
  word: string;
  start: number;
  end: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduced: boolean;
  last: boolean;
}) {
  const opacity = useTransform(progress, [start, end], [0.35, 1]);
  return (
    <>
      <motion.span style={reduced ? { opacity: 1 } : { opacity }}>{word}</motion.span>
      {/* A plain space outside the span keeps normal line wrapping. */}
      {last ? null : " "}
    </>
  );
}
