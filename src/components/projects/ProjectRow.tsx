import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import ProjectCarousel, { type CarouselSlide } from "./ProjectCarousel";
import { findImageMeta, projectImages } from "./roomLayout";

function buildSlides(project: Project): CarouselSlide[] {
  const slides: CarouselSlide[] = [];
  const seen = new Set<string>();
  const cover = findImageMeta(project, project.coverImage);
  if (project.coverImage) {
    seen.add(project.coverImage);
    slides.push({
      src: project.coverImage,
      alt: cover?.alt ?? project.title,
      width: cover?.width ?? 1600,
      height: cover?.height ?? 1100,
      kind: cover?.kind,
    });
  }
  for (const image of projectImages(project)) {
    if (image.kind !== "photo" || seen.has(image.src)) continue;
    seen.add(image.src);
    slides.push({ src: image.src, alt: image.alt, width: image.width, height: image.height, kind: image.kind });
  }
  return slides;
}

/** One project per row: details on the left, image carousel on the right. */
export default function ProjectRow({ project, priority }: { project: Project; priority?: boolean }) {
  const slides = buildSlides(project);
  const href = `/projects/${project.slug}`;
  const facts: [string, string][] = [
    ["Type of work", project.scope],
    ["Area", project.area ?? ""],
    ["Year", project.status === "Ongoing" ? "Ongoing" : project.year ? String(project.year) : ""],
    ["Status", project.status],
  ];

  return (
    <article className="grid gap-8 py-12 sm:py-16 lg:grid-cols-3 lg:gap-12 lg:py-20">
      <div className="lg:order-2 lg:col-span-2">
        {slides.length > 0 && <ProjectCarousel slides={slides} href={href} title={project.title} priority={priority} />}
      </div>

      <div className="flex flex-col lg:order-1 lg:pr-4">
        <h2 className="font-display text-4xl font-light leading-tight text-ink sm:text-5xl">{project.title}</h2>
        <p className="label mt-3">{project.location}</p>

        <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-hairline pt-5 text-sm leading-6">
          {facts
            .filter(([, value]) => value)
            .map(([name, value]) => (
              <div key={name} className="contents">
                <dt className="text-muted">{name}</dt>
                <dd className="text-ink">{value}</dd>
              </div>
            ))}
        </dl>

        <p className="mt-6 max-w-md text-base leading-7 text-muted">{project.summary}</p>

        <Link href={href} className="link-arrow mt-8 self-start text-brand hover:border-brand">
          View project
          <ArrowUpRight size={16} aria-hidden="true" />
          <span className="sr-only"> {project.title}</span>
        </Link>
      </div>
    </article>
  );
}
