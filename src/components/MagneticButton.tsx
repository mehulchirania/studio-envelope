"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";
import clsx from "clsx";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

/**
 * Subtle magnetic hover wrapper for desktop pointers. Purely decorative —
 * it only nudges the visual position on mousemove, so it never interferes
 * with click targets, focus order, or keyboard/touch interaction.
 */
export default function MagneticButton({
  children,
  className,
  strength = 0.25,
}: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  function handleMouseMove(e: MouseEvent<HTMLSpanElement>) {
    if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  }

  function handleMouseLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={clsx("inline-block transition-transform duration-300 ease-out", className)}
    >
      {children}
    </motion.span>
  );
}

