import type { Project } from "@/lib/types";
import ProjectCoverSection from "./ProjectCoverSection";

/** Renders the /projects listing body for a given (already-filtered) set of
 * projects, each as a full-bleed cover + image strip. Shared between the
 * client filter component and its Suspense fallback so both render
 * identically for the "All" state. */
export default function ProjectBlocks({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="band-bone">
        <div className="container-x section-y">
          <p className="text-[15px] text-muted">No projects in this scope yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {projects.map((project, i) => (
        <ProjectCoverSection key={project.id} project={project} index={i} priority={i === 0} />
      ))}
    </div>
  );
}
