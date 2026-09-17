"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { instagramPosts } from "@/lib/instagram";
import MagneticButton from "./MagneticButton";

export default function Hero({ image }: { image: string }) {
  const slides = [instagramPosts[0], instagramPosts[3], instagramPosts[4]];
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const current = slides[index];
  return <section className="new-hero"><div className="hero-topline"><span>Art / Architecture / Interior design</span><a href="https://www.instagram.com/studio__envelope/" target="_blank" rel="noopener noreferrer">@studio__envelope ↗</a></div><div className="hero-stage"><div className="hero-type"><p className="micro-label hero-enter"><span className="brand-dot" /> Here to design experiences</p><h1 className="hero-heading"><span className="hero-line"><span>Spaces</span></span><span className="hero-line"><span>to call</span></span><span className="hero-line"><span>your own.</span></span></h1><div className="hero-bottom hero-enter"><p>Art, architecture and interiors.<br />Here to design experiences that feel like you.</p><MagneticButton><a href="#selected" aria-label="Discover selected work" className="round-arrow"><ArrowDown size={22} /></a></MagneticButton></div></div><div className="hero-scene" role="region" aria-roledescription="carousel" aria-label="Studio photography"><AnimatePresence initial={false}><motion.div key={index} className="hero-slide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.65 }}><Image src={index === 0 ? image : current.image} alt={current.description} fill priority={index === 0} sizes="(max-width: 700px) 100vw, 55vw" className="object-cover" /></motion.div></AnimatePresence><div className="scene-caption"><span aria-live="polite" aria-atomic="true">{current.title}</span><a href={current.url} target="_blank" rel="noopener noreferrer">From the studio journal ↗</a></div><Link href="/projects" className="hero-project-link"><ArrowUpRight size={28} /><span>Step inside<br />our work</span></Link><div className="hero-controls"><button type="button" aria-label="Previous studio image" onClick={() => setIndex((index + slides.length - 1) % slides.length)}><ChevronLeft size={18} /></button><span aria-hidden="true">0{index + 1} / 0{slides.length}</span><button type="button" aria-label="Next studio image" onClick={() => setIndex((index + 1) % slides.length)}><ChevronRight size={18} /></button></div></div></div><div className="discipline-strip"><span>Art</span><i>+</i><span>Architecture</span><i>+</i><span>Interior design</span><i>+</i><span>Experiences</span></div></section>;
}

