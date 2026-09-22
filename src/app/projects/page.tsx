import type { Metadata } from "next";
import { Suspense } from "react";
import { getProjects } from "@/lib/data";
import ProjectsHero from "@/components/projects/ProjectsHero";
import ProjectsFilter from "@/components/projects/ProjectsFilter";
import ProjectBlocks from "@/components/projects/ProjectBlocks";

export const metadata: Metadata = {
  title: "Projects",
  description: "Homes and interiors designed by Studio Envelope, Bangalore.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <ProjectsHero total={projects.length} />
      {/* ProjectsFilter reads the ?scope= URL param via useSearchParams, so
          it needs a Suspense boundary; the fallback renders the same
          unfiltered list (behind the same band-dark chip-row spacer) so
          there is no visible flash or layout shift. */}
      <Suspense
        fallback={
          <>
            <div className="band-dark pb-14 sm:pb-20" />
            <ProjectBlocks projects={projects} />
          </>
        }
      >
        <ProjectsFilter projects={projects} />
      </Suspense>
    </>
  );
}
