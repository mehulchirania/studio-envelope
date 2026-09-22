"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type FaqItemProps = {
  q: string;
  a: string;
};

/** Accordion row: animates open/closed height + fade via framer-motion
 * (rather than the native <details> disclosure triangle) so it matches the
 * site's motion language. Fully keyboard accessible; reduced motion still
 * opens/closes, just without the height tween. */
export default function FaqItem({ q, a }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panelId = useId();

  return (
    <div className="border-b border-hairline py-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer list-none items-center justify-between gap-6 text-left"
      >
        <h3 className="font-display text-xl text-ink sm:text-2xl">{q}</h3>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 text-teal"
        >
          <Plus size={18} aria-hidden="true" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
