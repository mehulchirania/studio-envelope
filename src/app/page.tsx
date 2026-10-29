import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import WorkGlimpse from "@/components/home/WorkGlimpse";
import { findImage } from "@/lib/content/images";
import { getProjects } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import PageTransition from "@/components/layout/PageTransition";

const HOME_TITLE = "Architects & Interior Designers in Bangalore — Studio Envelope";

export const metadata: Metadata = {
  ...pageMetadata({
    title: HOME_TITLE,
    description:
      "Studio Envelope is an architect-led architecture and interior design studio in Bangalore, led by Ar. Prachi Chirania. Residential and commercial projects, with design consultations across India.",
    path: "/",
  }),
  title: { absolute: HOME_TITLE },
};

export default async function Home() {
  const projects = await getProjects();
  const james = projects.find((project) => project.slug === "james-residence");
  // A calm, portrait-format photograph that sits well beside the headline rather than behind it.
  const heroImage =
    findImage(james, "master-bedroom-2.jpg") ??
    projects[0]?.rooms[0]?.images[0] ?? {
      src: "/images/projects/james-residence/master-bedroom-2.jpg",
      alt: "Studio Envelope — Architecture & Interior Design, Bangalore",
      width: 1001,
      height: 1499,
      kind: "photo" as const,
    };
  // Every photograph from every project; the carousel shows a random selection.
  const glimpseImages = projects.flatMap((project) =>
    project.rooms.flatMap((room) =>
      room.images.filter((img) => img.kind === "photo").map((img) => ({ src: img.src, alt: img.alt, slug: project.slug })),
    ),
  );

  return (
    <PageTransition>
      <Hero image={heroImage} />
      <WorkGlimpse images={glimpseImages} />
    </PageTransition>
  );
}
