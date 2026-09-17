"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds, useful for lists rendered in a loop. */
  delay?: number;
  /** Direction the content travels in from. */
  from?: "up" | "down" | "none";
};

export default function RevealOnScroll({
  children,
  className,
  delay = 0,
  from = "up",
}: RevealOnScrollProps) {
  const prefersReducedMotion = useReducedMotion();

  const offset = from === "up" ? 28 : from === "down" ? -28 : 0;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : offset,
      clipPath: prefersReducedMotion
        ? "inset(0% 0% 0% 0%)"
        : "inset(0% 0% 12% 0%)",
    },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.9,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
