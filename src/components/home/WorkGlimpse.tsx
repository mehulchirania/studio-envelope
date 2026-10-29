"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type GlimpseImage = { src: string; alt: string; slug: string };

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Home page carousel: random photographs from every project, all the same size, no captions, drifting
 * left in a seamless loop (the list is rendered twice and the track slides 0 to -50%). It pauses on hover
 * and on keyboard focus, and under reduced motion becomes a plain scrollable row. The order is shuffled in
 * the browser after load so server and client markup match. */
export default function WorkGlimpse({ images, limit = 14 }: { images: GlimpseImage[]; limit?: number }) {
  const [items, setItems] = useState(() => images.slice(0, limit));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(shuffled(images).slice(0, limit));
  }, [images, limit]);

  if (images.length === 0) return null;

  // Roughly 4.5s per photograph keeps the drift calm (about 60s for a full cycle of 14).
  const cycle = `${Math.max(items.length, 4) * 4.5}s`;

  return (
    <section id="work" className="band-bone overflow-hidden py-14 sm:py-20" aria-labelledby="work-glimpse">
      {/* Keyframes live here (globals.css is not touched): the track slides one full copy, then repeats. */}
      <style>{`
        @keyframes glimpse-drift { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .glimpse-track { animation: glimpse-drift var(--glimpse-cycle) linear infinite; will-change: transform; }
        .glimpse-wrap:hover .glimpse-track, .glimpse-wrap:focus-within .glimpse-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .glimpse-track { animation: none; will-change: auto; }
          .glimpse-wrap { overflow-x: auto; scrollbar-width: none; }
          .glimpse-wrap::-webkit-scrollbar { display: none; }
          .glimpse-copy[aria-hidden="true"] { display: none; }
        }
      `}</style>

      <div className="container-x mb-8 sm:mb-10">
        <h2 id="work-glimpse" className="font-display text-[clamp(26px,2.6vw,38px)] font-normal leading-tight text-ink">
          A glimpse of our work.
        </h2>
      </div>

      <div className="glimpse-wrap overflow-hidden">
        <div
          className="glimpse-track flex w-max motion-reduce:px-[max(18px,calc((100vw-1600px)/2+18px))]"
          style={{ "--glimpse-cycle": cycle } as React.CSSProperties}
        >
          {[false, true].map((duplicate) => (
            <ul
              key={duplicate ? "copy" : "main"}
              aria-hidden={duplicate || undefined}
              className="glimpse-copy flex shrink-0 gap-2 pr-2"
            >
              {items.map((image, index) => (
                <li key={image.src} className="w-[65vw] max-w-[340px] shrink-0 sm:w-[340px]">
                  <Link
                    href={`/projects/${image.slug}`}
                    tabIndex={duplicate ? -1 : undefined}
                    className="relative block aspect-[4/5] overflow-hidden bg-paper-2"
                  >
                    <Image
                      src={image.src}
                      alt={duplicate ? "" : image.alt}
                      fill
                      sizes="(max-width: 640px) 65vw, 340px"
                      priority={!duplicate && index < 2}
                      className="object-cover"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="container-x mt-8 sm:mt-10">
        <Link href="/projects" className="link-arrow label">
          View all projects <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}
