"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  /** Max pull distance in px. */
  strength?: number;
};

/** A round CTA that gently pulls toward the cursor within its bounds, and
 * snaps back on leave. Renders as an <a> when `href` is given, otherwise a
 * <button>. Reduced motion disables the pull entirely (still fully usable). */
export default function MagneticButton({ children, className, href, onClick, strength = 18 }: MagneticButtonProps) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 14, stiffness: 180, mass: 0.4 });
  const springY = useSpring(y, { damping: 14, stiffness: 180, mass: 0.4 });

  function onMouseMove(e: MouseEvent<HTMLElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / (rect.width / 2)) * strength);
    y.set((relY / (rect.height / 2)) * strength);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const Tag = href ? motion.a : motion.button;

  return (
    <Tag
      href={href}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-flex flex-col items-center justify-center rounded-full bg-marigold text-abyss transition-colors hover:bg-bone ${className ?? ""}`}
    >
      {children}
    </Tag>
  );
}
