import type { Project } from "@/lib/content/types";
import ProjectCard from "./ProjectCard";

/** Two-column grid of project cards (one column on phones). */
export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <section className="band-bone">
      <div className="container-x grid gap-x-6 gap-y-12 py-12 sm:grid-cols-2 sm:py-20 lg:gap-x-8 lg:gap-y-16">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} sizes="(max-width: 640px) 100vw, 50vw" priority={index < 2} />
        ))}
      </div>
    </section>
  );
}
