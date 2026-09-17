"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
export default function ServicesAccordion({ services }: { services: { title: string; text: string; tags: string }[] }) {
  const [active, setActive] = useState<number | null>(0);
  const reduced = useReducedMotion();
  return <div className="service-list">{services.map((service, i) => <div className="service-item" key={service.title}><h3><button type="button" className="service-trigger" id={`service-trigger-${i}`} aria-expanded={active === i} aria-controls={`service-content-${i}`} onClick={() => setActive(active === i ? null : i)}><span className="service-number">0{i + 1}</span><span>{service.title}</span><Plus size={22} /></button></h3><div id={`service-content-${i}`} role="region" aria-labelledby={`service-trigger-${i}`}><AnimatePresence initial={false}>{active === i && <motion.div className="service-expansion" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : .35, ease: [.16, 1, .3, 1] }}><div className="service-content"><p>{service.text}</p><span>{service.tags}</span></div></motion.div>}</AnimatePresence></div></div>)}</div>;
}
