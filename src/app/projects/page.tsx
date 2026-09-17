import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import PageHero from "@/components/PageHero";
import ProjectsFilter from "@/components/ProjectsFilter";

export const metadata: Metadata = {
  title: "Work",
  description:
    "A collection of Studio Envelope's architecture, interior design, hospitality and art installation projects across India.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero eyebrow="Portfolio" title="Selected work">
        Architecture, interiors and installations — residential, commercial and
        hospitality projects designed across India.
      </PageHero>
      <div className="px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="mx-auto max-w-7xl">
          <ProjectsFilter projects={projects} />
        </div>
      </div>
    </>
  );
}
