"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";

type PreviewImage = { src: string; alt: string; width: number; height: number };
type Item = { id: string; image: PreviewImage };

type HoverPreviewContextValue = {
  setActive: (id: string | null) => void;
};

const HoverPreviewContext = createContext<HoverPreviewContextValue | null>(null);

/** Hook for a list row to call on hover/focus to set (or clear, with null)
 * the currently-previewed item id. Must be used inside <HoverPreview>. */
export function useHoverPreview() {
  const ctx = useContext(HoverPreviewContext);
  if (!ctx) throw new Error("useHoverPreview must be used inside <HoverPreview>");
  return ctx.setActive;
}

type HoverPreviewProps = {
  items: Item[];
  children: ReactNode;
  className?: string;
};

/** Wraps a text list (e.g. project rows). A floating image follows the
 * cursor with a spring and crossfades to whichever item id is currently
 * "active" (set via useHoverPreview from a list row's onMouseEnter). Desktop
 * only in effect — the floating image simply never appears without pointer
 * movement, so touch users are unaffected. */
export default function HoverPreview({ items, children, className }: HoverPreviewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 26, stiffness: 260, mass: 0.5 });
  const springY = useSpring(y, { damping: 26, stiffness: 260, mass: 0.5 });

  const active = items.find((item) => item.id === activeId) ?? null;

  return (
    <HoverPreviewContext.Provider value={{ setActive: setActiveId }}>
      <div
        className={`relative ${className ?? ""}`}
        onMouseEnter={(e) => {
          // Snap to the cursor on entry so the preview never flies in from the corner.
          const r = e.currentTarget.getBoundingClientRect();
          springX.jump(e.clientX - r.left + 24);
          springY.jump(e.clientY - r.top - 110);
        }}
        onMouseMove={(e) => {
          // Positioned relative to this wrapper: `fixed` breaks under transformed ancestors (page transitions).
          const r = e.currentTarget.getBoundingClientRect();
          x.set(e.clientX - r.left + 24);
          y.set(e.clientY - r.top - 110);
        }}
        onMouseLeave={() => setActiveId(null)}
      >
        {children}
        <AnimatePresence>
          {active && (
            <motion.div
              className="pointer-events-none absolute left-0 top-0 z-40 hidden h-[220px] w-[300px] overflow-hidden lg:block"
              style={{ x: springX, y: springY }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div key={active.id} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                <Image src={active.image.src} alt={active.image.alt} width={active.image.width} height={active.image.height} sizes="300px" className="h-full w-full object-cover" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </HoverPreviewContext.Provider>
  );
}
