"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import ProjectCard from "@/components/projects/ProjectCard";
import type { Project } from "@/lib/content/types";

/** Home page project strip: a native scroll-snap row (swipe on touch, arrow
 * buttons on desktop) with a link on to the full projects page. */
export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLUListElement>(null);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.78, behavior: "smooth" });
  }

  if (projects.length === 0) return null;

  const arrowButton =
    "grid h-11 w-11 place-items-center border border-hairline text-ink transition-colors hover:bg-ink hover:text-bone";

  return (
    <section className="band-bone border-t border-hairline py-14 sm:py-24" aria-labelledby="featured-projects">
      <div className="container-x mb-8 flex items-end justify-between gap-8 sm:mb-10">
        <h2 id="featured-projects" className="h2 text-ink">
          A glimpse of our work.
        </h2>
        <div className="hidden items-center gap-2 sm:flex">
          <button type="button" onClick={() => move(-1)} aria-label="Previous projects" className={arrowButton}>
            <ArrowLeft size={18} />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Next projects" className={arrowButton}>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] sm:scroll-px-[max(3vw,calc((100vw-1600px)/2+48px))] sm:gap-6 sm:px-[max(3vw,calc((100vw-1600px)/2+48px))] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, index) => (
          <li key={project.id} className="w-[84vw] max-w-[720px] shrink-0 snap-start">
            <ProjectCard project={project} sizes="(max-width: 768px) 84vw, 720px" priority={index === 0} />
          </li>
        ))}
      </ul>

      <div className="container-x mt-8">
        <Link href="/projects" className="link-arrow label py-2">
          View all projects <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}
