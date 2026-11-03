import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import WhyEnvelope from "@/components/home/WhyEnvelope";
import FounderNote from "@/components/home/FounderNote";
import WorkGlimpse from "@/components/home/WorkGlimpse";
import { getProjects } from "@/lib/data";
import { pageMetadata, SHARE_DESCRIPTION, SHARE_TITLE } from "@/lib/seo";
import PageTransition from "@/components/layout/PageTransition";

const home = pageMetadata({ title: SHARE_TITLE, description: SHARE_DESCRIPTION, path: "/" });

export const metadata: Metadata = {
  ...home,
  title: { absolute: SHARE_TITLE },
  openGraph: { ...home.openGraph, title: SHARE_TITLE },
  twitter: { ...home.twitter, title: SHARE_TITLE },
};

export default async function Home() {
  const projects = await getProjects();
  // Every photograph from every project; the carousel shows a random selection.
  const glimpseImages = projects.flatMap((project) =>
    project.rooms.flatMap((room) =>
      room.images.filter((img) => img.kind === "photo").map((img) => ({ src: img.src, alt: img.alt, slug: project.slug })),
    ),
  );

  return (
    <PageTransition>
      <Hero />
      <WhyEnvelope
        image={{ src: "/images/site/kitchen-detail.jpg", alt: "A hand embroidered mirror work runner draped over a kitchen counter beside a cane fruit basket" }}
      />
      <FounderNote />
      <WorkGlimpse images={glimpseImages} />
    </PageTransition>
  );
}
