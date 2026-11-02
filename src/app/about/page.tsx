import type { Metadata } from "next";
import Image from "next/image";
import WhyEnvelope from "@/components/home/WhyEnvelope";
import PageHero from "@/components/ui/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { site } from "@/lib/content/site";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import PageTransition from "@/components/layout/PageTransition";

export const metadata: Metadata = pageMetadata({
  title: "About: Ar. Prachi Chirania",
  description:
    "Studio Envelope is an architecture and interior design practice in Bangalore, led by Founder and Creative Director Ar. Prachi Chirania. Residential and commercial projects across India.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageTransition>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ])}
      />
      <PageHero
        title={site.whyEnvelope.heading}
        background={{ src: "/images/site/home-office.jpg", alt: "Home office with a walnut desk, built in shelving and sheer curtains" }}
      />

      <WhyEnvelope
        hideHeading
        tone="bone"
        image={{ src: "/images/site/blue-veranda.jpg", alt: "Veranda corner with a cane back armchair against a deep blue wall and potted plants" }}
      />

      <section className="band-dark">
        <div className="container-x grid gap-10 py-14 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
            <Image
              src="/images/site/prachi-chirania.jpg"
              alt="Portrait of Prachi Chirania"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[50%_30%]"
            />
          </div>

          <div>
            <p className="label text-mist">{site.principal.role}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,2.7vw,44px)] font-light leading-tight text-bone lg:whitespace-nowrap">{site.principal.name}</h2>
            <div className="mt-6 max-w-xl space-y-5 text-base leading-7 text-mist [hyphens:manual] [text-wrap:pretty]">
              {site.principal.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <a href={site.principal.instagram} target="_blank" rel="noopener noreferrer" className="link-underline mt-8 inline-flex py-2 text-lg text-bone">
              {site.principal.instagramHandle}
            </a>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
