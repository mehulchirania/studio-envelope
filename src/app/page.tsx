import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import WhyEnvelope from "@/components/home/WhyEnvelope";
import WorkGlimpse from "@/components/home/WorkGlimpse";
import { getHomeCarousel, getProjects } from "@/lib/data";
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
  const [projects, curated] = await Promise.all([getProjects(), getHomeCarousel()]);
  // A list saved in the admin is shown as is; otherwise every project photograph, of which the carousel shows a random selection.
  const glimpseImages = curated
    ? curated.map((img) => ({ src: img.src, alt: img.alt, slug: img.slug ?? "" }))
    : projects.flatMap((project) =>
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
      <WorkGlimpse images={glimpseImages} curated={Boolean(curated)} />
    </PageTransition>
  );
}
