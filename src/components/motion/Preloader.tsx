"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "se-preloaded";

/** First-visit-per-session intro: an abyss screen where the logo mark builds
 * (marigold bars slide in, triangle scales in, dot pops), a 0→100 counter
 * ticks, then a curtain wipes up to reveal the page. Runs once per browser
 * session (sessionStorage, wrapped in try/catch for private-mode safety).
 * Total runtime is capped around 2.2s. Skips entirely under
 * prefers-reduced-motion, or if sessionStorage says it already ran. */
export default function Preloader() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with prefers-reduced-motion
      setPhase("done");
      return;
    }
    let already = false;
    try {
      already = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      already = false;
    }
    if (already) {
      setPhase("done");
      return;
    }
    setPhase("running");
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore — worst case the preloader runs again on the next page
    }
  }, [reduced]);

  useEffect(() => {
    if (phase !== "running") return;
    const start = performance.now();
    const totalMs = 1500;
    let frame = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const progress = Math.min(1, elapsed / totalMs);
      setCount(Math.round(progress * 100));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        const timeout = setTimeout(() => setPhase("done"), 500);
        return () => clearTimeout(timeout);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  return (
    <AnimatePresence>
      {phase === "running" && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 bg-abyss"
          initial={{ clipPath: "inset(0 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.77, 0, 0.18, 1] }}
        >
          <div className="flex items-center gap-3">
            <motion.span
              className="h-1.5 w-16 bg-marigold"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-3 w-3 rounded-full bg-marigold"
            />
            <motion.span
              className="h-1.5 w-16 bg-marigold"
              initial={{ scaleX: 0, originX: 1 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="label tabular-nums text-mist">{count.toString().padStart(3, "0")}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
