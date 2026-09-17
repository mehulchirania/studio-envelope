"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Decorative cursor-follower glow.
 *
 * It never hides or replaces the native cursor and is fully
 * `pointer-events: none`, so it cannot break clicking, dragging, text
 * selection, or keyboard navigation. Visibility for touch devices and
 * `prefers-reduced-motion` is handled purely in CSS (see `.cursor-glow` in
 * globals.css) so nothing here needs to gate rendering with client state.
 */
export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 30, stiffness: 250, mass: 0.5 });
  const springY = useSpring(y, { damping: 30, stiffness: 250, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    function handleMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      setHovering(Boolean(target?.closest("a, button, [role='button']")));
    }

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className="cursor-glow pointer-events-none fixed left-0 top-0 z-[70] mix-blend-difference"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        animate={{ width: hovering ? 44 : 20, height: hovering ? 44 : 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="rounded-full border border-fg/70"
      />
    </motion.div>
  );
}
