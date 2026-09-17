"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { instagramPosts } from "@/lib/instagram";
import RevealOnScroll from "./RevealOnScroll";
export default function StudioJournal() {
  const track = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const open = (index: number) => { setSelected(index); dialog.current?.showModal(); };
  const slide = (direction: number) => { const el = track.current; if (el) el.scrollBy({ left: direction * el.clientWidth * .75, behavior: reduced ? "instant" : "smooth" }); };
  const current = instagramPosts[selected];
  return <section className="studio-journal page-gutter"><RevealOnScroll><div className="section-heading"><div><p className="micro-label">05 / From Instagram</p><h2>The details<br />make the difference.</h2></div><div className="journal-actions"><a href="https://www.instagram.com/studio__envelope/" target="_blank" rel="noopener noreferrer" className="line-link">@studio__envelope <ArrowUpRight size={18} /></a><div><button type="button" aria-label="Scroll journal left" onClick={() => slide(-1)}><ChevronLeft size={20} /></button><button type="button" aria-label="Scroll journal right" onClick={() => slide(1)}><ChevronRight size={20} /></button></div></div></div></RevealOnScroll><div className="journal-track" ref={track} tabIndex={0} aria-label="Studio photo journal — scroll for more photographs">{instagramPosts.map((post, i) => <button type="button" key={post.slug} className="journal-photo" onClick={() => open(i)} aria-label={`Enlarge ${post.title}`}><Image src={post.image} alt={post.description} fill sizes="(max-width: 700px) 75vw, 25vw" className="object-cover" /><span><span>{post.title}</span><Maximize2 size={16} /></span></button>)}</div><p className="journal-hint">A closer look at the spaces we share. Swipe to explore, tap to see the details.</p><dialog data-lenis-prevent ref={dialog} className="journal-dialog" aria-label="Studio photograph viewer" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={event => { if (event.key === "ArrowRight") setSelected((selected + 1) % instagramPosts.length); if (event.key === "ArrowLeft") setSelected((selected + instagramPosts.length - 1) % instagramPosts.length); }}><div className="journal-lightbox"><button className="lightbox-close" type="button" aria-label="Close photograph" onClick={() => dialog.current?.close()} autoFocus><X size={24} /></button><div className="lightbox-image"><Image src={current.image} alt={current.description} fill sizes="(max-width: 700px) 90vw, 640px" className="object-contain" /></div><div className="lightbox-caption"><button type="button" aria-label="Previous photograph" onClick={() => setSelected((selected + instagramPosts.length - 1) % instagramPosts.length)}><ChevronLeft /></button><div aria-live="polite"><p>{current.title}</p><a href={current.url} target="_blank" rel="noopener noreferrer">View original post ↗</a><span>{selected + 1} / {instagramPosts.length}</span></div><button type="button" aria-label="Next photograph" onClick={() => setSelected((selected + 1) % instagramPosts.length)}><ChevronRight /></button></div></div></dialog></section>;
}


