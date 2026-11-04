import type { Metadata } from "next";
import ProjectGrid from "@/components/projects/ProjectGrid";
import JsonLd from "@/components/seo/JsonLd";
import { getProjects } from "@/lib/data";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import PageTransition from "@/components/layout/PageTransition";

export const metadata: Metadata = pageMetadata({
  title: "Selected Architecture & Interior Design Projects",
  description: "Architecture and interior design projects by Studio Envelope, from homes to commercial spaces across India.",
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
      <PageHero
        title="Projects"
        background={{ src: "/images/site/dining-mural.jpg", alt: "Dining area with a carved mirror-work mural wall, grey leather chairs and a mirrored crockery unit" }}
      >
        Residential architecture and interiors, each shaped by its people, place and pace of living.
      </PageHero>
      <ProjectGrid projects={projects} />
    </PageTransition>
  );
}
