import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProjectImage from "@/components/ui/ProjectImage";
import type { Project } from "@/lib/content/types";
import { findImageMeta } from "./roomLayout";

type ProjectCardProps = {
  project: Project;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** A project's cover, title, location and one line of facts, linking to its page. */
export default function ProjectCard({ project, sizes, priority, className }: ProjectCardProps) {
  const cover = findImageMeta(project, project.coverImage);
  const facts = [project.area, project.scope, project.status === "Ongoing" ? "Ongoing" : project.year].filter(Boolean).join(" · ");

  return (
    <Link href={`/projects/${project.slug}`} className={`group block ${className ?? ""}`}>
      <ProjectImage
        image={{
          src: project.coverImage,
          alt: cover?.alt ?? project.title,
          width: cover?.width ?? 1600,
          height: cover?.height ?? 1100,
        }}
        sizes={sizes}
        priority={priority}
        className="aspect-[4/3]"
      />
      <div className="mt-4 flex items-start justify-between gap-5 border-t border-hairline pt-4">
        <div>
          <h3 className="font-display text-3xl font-light text-ink sm:text-4xl">{project.title}</h3>
          <p className="label mt-2">{project.location}</p>
          {facts && <p className="mt-2 text-sm leading-6 text-muted">{facts}</p>}
        </div>
        <ArrowUpRight
          className="mt-1 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          size={20}
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
