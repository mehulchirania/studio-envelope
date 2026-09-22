"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * A small marigold dot + ring that follows the cursor and grows into a
 * labelled disc over any element carrying `data-cursor="view"` (shows
 * "View") or `data-cursor="drag"` (shows "Drag"). Desktop fine-pointer only
 * — renders nothing on touch devices or reduced motion. Mount once, near the
 * root of the app (see layout.tsx).
 */
export default function CursorFollower() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 28, stiffness: 320, mass: 0.4 });
  const springY = useSpring(y, { damping: 28, stiffness: 320, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with a platform media query, not React state
    setEnabled(fine && !reduced);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    function onMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      setLabel(target?.dataset.cursor === "drag" ? "Drag" : target?.dataset.cursor === "view" ? "View" : null);
    }
    function onLeave() {
      setVisible(false);
    }

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full bg-marigold mix-blend-difference"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: label ? 72 : 10,
        height: label ? 72 : 10,
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: "spring", damping: 24, stiffness: 300 }}
    >
      {label && <span className="label text-[10px] text-abyss">{label}</span>}
    </motion.div>
  );
}
