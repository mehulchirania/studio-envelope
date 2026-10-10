import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Hero from "@/components/home/Hero";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import { findImage } from "@/lib/content/images";
import { getProjects } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/content/site";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Studio Envelope — Architecture & Interior Design Studio, Bangalore", description: site.description, path: "/" }),
  title: { absolute: "Studio Envelope — Architecture & Interior Design Studio, Bangalore" },
};

export default async function Home() {
  const projects = await getProjects();
  const heroImage = findImage(projects.find((project) => project.slug === "james-residence"), "kitchen-dining.jpg");

  return (
    <>
      {heroImage && <Hero image={heroImage} />}

      <section id="studio" className="band-bone scroll-mt-20">
        <div className="container-x grid gap-8 py-14 sm:py-24 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <p className="label pt-2">Studio Envelope</p>
          <div>
            <p className="max-w-[24ch] font-display text-[clamp(30px,4.5vw,64px)] font-light leading-[1.08] text-ink">
              Thoughtful homes, shaped around the people who live in them.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:mt-8 sm:text-lg">
              We bring architecture, interiors and styling together in one considered process—balancing clarity, character and everyday ease.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 sm:mt-10">
              <Link href="/about" className="link-arrow label py-2">
                About the studio <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/services" className="link-arrow label py-2">
                Our services <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProjects projects={projects} />
    </>
  );
}
