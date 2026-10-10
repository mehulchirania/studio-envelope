import type { Metadata } from "next";
import ProjectGrid from "@/components/projects/ProjectGrid";
import JsonLd from "@/components/seo/JsonLd";
import { getProjects } from "@/lib/data";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import PageTransition from "@/components/layout/PageTransition";

export const metadata: Metadata = pageMetadata({
  title: "Selected Architecture & Interior Design Projects",
  description: "Residential architecture and interior design projects in Bangalore, Ballari and Pune by Studio Envelope.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <PageTransition>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" },
        ])}
      />
      <section className="band-dark flex min-h-[48svh] items-end pt-28 sm:min-h-[54svh] sm:pt-40">
        <div className="container-x w-full pb-10 sm:pb-16">
          <h1 className="h1 max-w-4xl text-bone">Projects</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-mist sm:mt-8 sm:text-lg">
            Residential architecture and interiors, each shaped by its people, place and pace of living.
          </p>
        </div>
      </section>
      <ProjectGrid projects={projects} />
    </PageTransition>
  );
}
