"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, Pause, Play, X } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { instagramPosts } from "@/lib/instagram";
import RevealOnScroll from "./RevealOnScroll";

const AUTOPLAY_MS = 3000;

export default function StudioJournal() {
  const track = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false); // hover / focus / lightbox open
  const reduced = useReducedMotion();
  const current = instagramPosts[selected];

  const goTo = useCallback((index: number) => {
    const el = track.current;
    if (!el) return;
    const slide = el.children[index] as HTMLElement | undefined;
    if (!slide) return;
    const left = slide.offsetLeft - el.offsetLeft;
    setActive(index); // don't wait for the scroll event; the dots should answer the click at once
    el.scrollTo({ left, behavior: reduced ? "instant" : "smooth" });
    // Smooth scrolling needs animation frames, which a backgrounded or throttled tab
    // may never deliver. If nothing has moved shortly after, jump straight there.
    if (reduced) return;
    const from = el.scrollLeft;
    window.setTimeout(() => {
      if (track.current === el && el.scrollLeft === from && Math.abs(left - from) > 1) {
        el.scrollLeft = left;
      }
    }, 350);
  }, [reduced]);

  /** The slide nearest the left edge right now — read from the DOM so swiping,
   *  the arrows and the dots can never disagree about where we are. */
  const nearestIndex = useCallback(() => {
    const el = track.current;
    if (!el) return 0;
    // Several slides are visible at once, so the final ones all share the same scroll
    // position. Treat "scrolled to the end" as the last slide, or autoplay never loops.
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) return instagramPosts.length - 1;
    let best = 0;
    let bestDistance = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const distance = Math.abs((child as HTMLElement).offsetLeft - el.offsetLeft - el.scrollLeft);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    return best;
  }, []);

  const step = useCallback((direction: number) => {
    goTo((nearestIndex() + direction + instagramPosts.length) % instagramPosts.length);
  }, [goTo, nearestIndex]);

  // Auto-advance, unless the visitor prefers reduced motion, has paused it, or is interacting.
  useEffect(() => {
    if (reduced || !playing || paused) return;
    const id = setInterval(() => step(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reduced, playing, paused, step]);

  const openLightbox = (index: number) => {
    setSelected(index);
    setPaused(true);
    dialog.current?.showModal();
  };

  return (
    <section className="studio-journal page-gutter">
      <RevealOnScroll className="section-heading">
        <div>
          <p className="micro-label">05 / From Instagram</p>
          <h2>
            The details
            <br />
            make the difference.
          </h2>
        </div>
        <div className="journal-actions">
          <a
            href="https://www.instagram.com/studio__envelope/"
            target="_blank"
            rel="noopener noreferrer"
            className="line-link"
          >
            @studio__envelope <ArrowUpRight size={18} />
          </a>
          <div>
            <button type="button" aria-label="Previous photograph" onClick={() => step(-1)}>
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label={playing && !reduced ? "Pause the carousel" : "Play the carousel"}
              aria-pressed={playing && !reduced}
              onClick={() => setPlaying(!playing)}
            >
              {playing && !reduced ? <Pause size={17} /> : <Play size={17} />}
            </button>
            <button type="button" aria-label="Next photograph" onClick={() => step(1)}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </RevealOnScroll>

      <div
        className="journal-carousel"
        role="group"
        aria-roledescription="carousel"
        aria-label="Photographs from the studio's Instagram"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className="journal-track"
          ref={track}
          tabIndex={0}
          onScroll={() => setActive(nearestIndex())}
          role="group"
          aria-label="Photo slides — use the arrow keys to move between them"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
            if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
          }}
        >
          {instagramPosts.map((post, i) => (
            <div
              className="journal-slide"
              key={post.slug}
              data-index={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${instagramPosts.length}`}
            >
              <button type="button" className="journal-photo" onClick={() => openLightbox(i)} aria-label={`Enlarge ${post.title}`}>
                <Image src={post.image} alt={post.description} fill sizes="(max-width: 700px) 78vw, 27vw" className="object-cover" />
                <span>
                  <span>{post.title}</span>
                  <Maximize2 size={16} />
                </span>
              </button>
            </div>
          ))}
        </div>

        <div className="journal-dots" role="tablist" aria-label="Choose a photograph">
          {instagramPosts.map((post, i) => (
            <button
              key={post.slug}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={post.title}
              className={active === i ? "is-active" : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

      <p className="journal-hint" aria-live="polite">
        {active + 1} of {instagramPosts.length} — {instagramPosts[active].title}. Tap a photograph to see it larger.
      </p>

      <dialog
        data-lenis-prevent
        ref={dialog}
        className="journal-dialog"
        aria-label="Studio photograph viewer"
        onClose={() => setPaused(false)}
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") setSelected((selected + 1) % instagramPosts.length);
          if (event.key === "ArrowLeft") setSelected((selected + instagramPosts.length - 1) % instagramPosts.length);
        }}
      >
        <div className="journal-lightbox">
          <button className="lightbox-close" type="button" aria-label="Close photograph" onClick={() => dialog.current?.close()} autoFocus>
            <X size={24} />
          </button>
          <div className="lightbox-image">
            <Image src={current.image} alt={current.description} fill sizes="(max-width: 700px) 90vw, 640px" className="object-contain" />
          </div>
          <div className="lightbox-caption">
            <button type="button" aria-label="Previous photograph" onClick={() => setSelected((selected + instagramPosts.length - 1) % instagramPosts.length)}>
              <ChevronLeft />
            </button>
            <div aria-live="polite">
              <p>{current.title}</p>
              <a href={current.url} target="_blank" rel="noopener noreferrer">View original post ↗</a>
              <span>{selected + 1} / {instagramPosts.length}</span>
            </div>
            <button type="button" aria-label="Next photograph" onClick={() => setSelected((selected + 1) % instagramPosts.length)}>
              <ChevronRight />
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
