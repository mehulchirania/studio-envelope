"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
export default function SiteMotion({ children }: { children: ReactNode }) {
  const { scrollY, scrollYProgress } = useScroll();
  const [showTop, setShowTop] = useState(false);
  const reduced = useReducedMotion();
  useMotionValueEvent(scrollY, "change", value => setShowTop(value > 800));
  return <MotionConfig reducedMotion="user"><motion.div aria-hidden="true" className="reading-progress" style={{ scaleX: scrollYProgress }} />{children}<AnimatePresence>{showTop && <motion.a href="#page-top" aria-label="Back to top" className="back-to-top" initial={{ opacity: 0, y: reduced ? 0 : 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><ArrowUp size={19} /></motion.a>}</AnimatePresence></MotionConfig>;
}
