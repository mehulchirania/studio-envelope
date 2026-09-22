"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Route-change transition. Mounted from src/app/template.tsx, which Next
 * gives a fresh key per navigation — so this component remounts on every
 * route change. The new page is already rendered underneath; a marigold bar
 * sweeps across first, then a night curtain covers and immediately wipes
 * away to reveal it, and the whole overlay unmounts once done. Purely a
 * cosmetic overlay (pointer-events-none, aria-hidden), so content is never
 * actually hidden from anything but the eye, and never gets stuck if JS is
 * slow. Total ≤700ms. Reduced motion renders nothing. */
export default function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [showOverlay, setShowOverlay] = useState(!reduced);

  return (
    <>
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[150]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="absolute inset-0 origin-top bg-night"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 0.55, ease: [0.77, 0, 0.18, 1], delay: 0.1 }}
            />
            <motion.div
              className="absolute inset-x-0 top-0 h-1 origin-left bg-marigold"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 1, 0] }}
              style={{ transformOrigin: "left" }}
              transition={{ duration: 0.65, times: [0, 0.35, 0.6, 1], ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => setShowOverlay(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
