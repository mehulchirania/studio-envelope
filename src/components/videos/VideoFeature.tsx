"use client";

import { useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import type { VideoFact } from "@/lib/content/videos";

interface VideoFeatureProps {
  title: string;
  credits?: string;
  facts?: VideoFact[];
  youtubeId?: string;
  src?: string;
  poster?: string;
  /** Link target when the film belongs to a project. */
  href?: string;
}

export default function VideoFeature({ title, credits, facts, youtubeId, src, poster, href }: VideoFeatureProps) {
  const [playing, setPlaying] = useState(false);
  const posterSrc = poster ?? (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined);

  return (
    <article className="text-center">
      <h2 className="font-display text-[clamp(30px,3.4vw,48px)] font-light leading-tight text-ink">
        {href ? (
          <Link href={href} className="link-underline">
            {title}
          </Link>
        ) : (
          title
        )}
      </h2>
      {credits && <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted">{credits}</p>}

      {facts && facts.length > 0 && (
        <dl className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-x-10 gap-y-5 sm:mt-10 sm:gap-x-14">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-[7rem]">
              <dt className="label text-brand">{fact.label}</dt>
              <dd className="mt-1.5 text-base text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="relative mx-auto mt-10 aspect-video w-full overflow-hidden bg-ink sm:mt-12">
        {playing ? (
          youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <video src={src} poster={poster} controls autoPlay playsInline className="absolute inset-0 h-full w-full object-cover" />
          )
        ) : (
          <>
            {posterSrc && (
              // Plain img: the YouTube thumbnail domain is not in next.config remotePatterns.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={posterSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play film: ${title}`}
              className="group absolute inset-0 flex items-center justify-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-bone"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-bone transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
                <Play size={26} fill="currentColor" className="ml-1" aria-hidden="true" />
              </span>
            </button>
          </>
        )}
      </div>
    </article>
  );
}
