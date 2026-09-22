import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import type { Project } from "@/lib/types";
import Datasheet from "@/components/Datasheet";
import ProjectImage from "@/components/ProjectImage";
import ParallaxImage from "@/components/motion/ParallaxImage";
import RevealText from "@/components/motion/RevealText";
import { projectImages } from "./roomLayout";

/**
 * One project on /projects: a full-bleed parallax cover (~80vh) with the
 * title/datasheet/"View project" overlaid on a night gradient, followed by a
 * tight 4-image strip. The strip's band alternates bone/night per project
 * index so the page never reads as empty white.
 */
export default function ProjectCoverSection({
  project,
  index,
  priority,
}: {
  project: Project;
  index: number;
  priority?: boolean;
}) {
  const images = projectImages(project);
  const cover = images.find((img) => img.src === project.coverImage) ?? images[0];
  const strip = images.filter((img) => img.src !== cover?.src).slice(0, 4);
  const stripTone: "dark" | "light" = index % 2 === 0 ? "dark" : "light";

  const items = [
    { label: "Location", value: project.location },
    ...(project.area ? [{ label: "Area", value: project.area }] : []),
    { label: "Scope", value: project.scope },
    { label: "Year", value: project.status === "Ongoing" ? "Ongoing" : String(project.year) },
  ];

  return (
    <article className="border-t border-hairline-light first:border-t-0">
      <Link
        href={`/projects/${project.slug}`}
        data-cursor="view"
        className="group relative block h-[80vh] min-h-[440px] w-full overflow-hidden"
      >
        {cover && (
          <ParallaxImage
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            sizes="100vw"
            priority={priority}
            overlay
            className="h-full w-full"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="container-x pb-10 sm:pb-14">
            <p className="label mb-4 text-mist">
              {String(index + 1).padStart(2, "0")} — {project.scope}
            </p>
            <h2 className="display-xl text-bone transition-colors duration-500 group-hover:text-marigold">
              <RevealText text={project.title} />
            </h2>
            {project.subtitle && (
              <p className="mt-4 max-w-xl font-display text-xl italic text-mist sm:text-2xl">{project.subtitle}</p>
            )}
            <Datasheet items={items} tone="dark" className="mt-8" />
            <span className="link-arrow mt-8 border-bone/30 text-bone">
              View project <ArrowUpRight size={16} />
            </span>
          </div>
        </div>
      </Link>

      {strip.length > 0 && (
        <div className={stripTone === "dark" ? "band-dark" : "band-bone"}>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {strip.map((image) => (
              <Link key={image.src} href={`/projects/${project.slug}`} className={clsx("block aspect-[4/5]")}>
                <ProjectImage
                  image={image}
                  sizes="(min-width: 768px) 24vw, 46vw"
                  tone={stripTone}
                  cursor="view"
                  className="h-full w-full"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
