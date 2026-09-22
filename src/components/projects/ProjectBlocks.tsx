import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import Datasheet from "@/components/Datasheet";
import ProjectImage from "@/components/ProjectImage";
import { projectImages } from "./roomLayout";

/** Renders the /projects listing body for a given (already-filtered) set of
 * projects: per project a title, datasheet, optional credit, an image grid
 * of up to 8 room images, and a "View project" link. Shared between the
 * client filter component and its Suspense fallback so both render
 * identically for the "All" state. */
export default function ProjectBlocks({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <p className="text-[15px] text-muted">No projects in this scope yet.</p>;
  }

  return (
    <div className="divide-y divide-hairline">
      {projects.map((project, i) => {
        const images = projectImages(project).slice(0, 8);
        const items = [
          { label: "Location", value: project.location },
          ...(project.area ? [{ label: "Area", value: project.area }] : []),
          { label: "Scope", value: project.scope },
          { label: "Year", value: project.status === "Ongoing" ? "Ongoing" : String(project.year) },
        ];

        return (
          <article key={project.id} className={i === 0 ? "pb-20 sm:pb-28" : "py-20 sm:py-28"}>
            <Link href={`/projects/${project.slug}`} className="group inline-block">
              <h2 className="h2 text-ink transition-colors group-hover:text-teal">{project.title}</h2>
            </Link>
            {project.subtitle && (
              <p className="mt-3 max-w-xl font-display text-xl italic text-muted">{project.subtitle}</p>
            )}
            <Datasheet items={items} className="mt-8" />
            {project.credit && <p className="mt-5 text-[15px] text-muted">{project.credit}</p>}

            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {images.map((image, imgIndex) => (
                <ProjectImage
                  key={image.src}
                  image={image}
                  sizes="(min-width: 768px) 24vw, 46vw"
                  className="aspect-[4/5]"
                  priority={i === 0 && imgIndex < 2}
                />
              ))}
            </div>

            <Link href={`/projects/${project.slug}`} className="link-arrow mt-10">
              View project <ArrowUpRight size={16} />
            </Link>
          </article>
        );
      })}
    </div>
  );
}
