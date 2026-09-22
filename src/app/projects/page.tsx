import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import { getProjects } from "@/lib/data";
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
      <PageHero label="Projects" title="Homes, written with care.">
        Interiors and architecture for families across Bangalore, Ballari and Pune.
      </PageHero>
      <div className="container-x section-y">
        {/* ProjectsFilter reads the ?scope= URL param via useSearchParams, so
            it needs a Suspense boundary; the fallback renders the same
            unfiltered list so there is no visible flash. */}
        <Suspense fallback={<ProjectBlocks projects={projects} />}>
          <ProjectsFilter projects={projects} />
        </Suspense>
      </div>
    </>
  );
}
