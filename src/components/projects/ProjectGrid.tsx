import type { Project } from "@/lib/content/types";
import ProjectRow from "./ProjectRow";

/** One project per row, separated by hairline rules. */
export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <section className="band-bone">
      <div className="container-x divide-y divide-hairline">
        {projects.map((project, index) => (
          <ProjectRow key={project.id} project={project} priority={index === 0} />
        ))}
      </div>
    </section>
  );
}
