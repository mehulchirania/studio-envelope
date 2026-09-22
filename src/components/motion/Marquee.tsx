"use client";

import { useAnimationControls, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect } from "react";

type MarqueeProps = {
  children: ReactNode;
  /** Seconds for one full loop. Lower = faster. Defaults to 22. */
  speed?: number;
  reverse?: boolean;
  className?: string;
};

/** Infinite horizontal ribbon: the content is duplicated and translated
 * -50%, looping seamlessly. Pauses on hover/focus. Reduced motion renders a
 * single static, non-scrolling copy. */
export default function Marquee({ children, speed = 22, reverse = false, className }: MarqueeProps) {
  const reduced = useReducedMotion();
  const controls = useAnimationControls();

  useEffect(() => {
    if (reduced) return;
    controls.start({
      x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
      transition: { duration: speed, ease: "linear", repeat: Infinity },
    });
  }, [controls, reduced, reverse, speed]);

  if (reduced) {
    return (
      <div className={`w-full min-w-0 max-w-full overflow-hidden ${className ?? ""}`}>
        <div className="flex w-max items-center gap-12">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-w-0 max-w-full overflow-hidden ${className ?? ""}`}
      onMouseEnter={() => controls.stop()}
      onMouseLeave={() =>
        controls.start({
          x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
          transition: { duration: speed, ease: "linear", repeat: Infinity },
        })
      }
    >
      <motion.div className="flex w-max items-center gap-12" animate={controls}>
        <div className="flex w-max items-center gap-12">{children}</div>
        <div className="flex w-max items-center gap-12" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
