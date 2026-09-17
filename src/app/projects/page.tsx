import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import PageHero from "@/components/PageHero";
import ProjectsFilter from "@/components/ProjectsFilter";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Rooms, details and interior explorations from Studio Envelope, sourced from the studio journal.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero eyebrow="Portfolio" title="Selected work">
        Rooms, details and material explorations from the Studio Envelope journal. Step inside, then visit the original posts for more.
      </PageHero>
      <div className="px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="mx-auto max-w-7xl">
          <ProjectsFilter projects={projects} />
        </div>
      </div>
    </>
  );
}


