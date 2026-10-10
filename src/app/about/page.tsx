import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import Seal from "@/components/ui/Seal";
import JsonLd from "@/components/seo/JsonLd";
import { findImage } from "@/lib/content/images";
import { site } from "@/lib/content/site";
import { getProjects } from "@/lib/data";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "The Studio — Ar. Prachi Chirania Bhalotia",
  description:
    "Studio Envelope is an architecture and interior design practice in Bangalore, led by Principal Architect Ar. Prachi Chirania Bhalotia. Thoughtful homes across Bangalore, Ballari and Pune.",
  path: "/about",
});

const NOTE_PARAGRAPHS = [
  'The name "Studio Envelope" evokes warmth, authenticity and intentionality. Our studio delivers spaces that are thoughtful and personal, much like the cherished messages enclosed in an envelope.',
  "We create cohesive spaces with design solutions that blend creativity, precision and purpose—wrapped with care and shaped around each client's personality and needs.",
  "Innovative thinking and meticulous planning bring function and aesthetics into harmony, creating spaces that feel considered, personal and easy to live in.",
];

export default async function AboutPage() {
  const projects = await getProjects();
  const james = projects.find((project) => project.slug === "james-residence");
  const heroImage = findImage(james, "living.jpg");
  // Stand-in until the principal's own photo is supplied.
  const principalImage = findImage(james, "master-bedroom-2.jpg") ?? findImage(james, "master-bedroom-1.jpg");

  return (
    <>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "The Studio", url: "/about" },
        ])}
      />
      <PageHero title="Why an envelope?" background={heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined}>
        A note on what the name means, and how it shapes the way we design.
      </PageHero>

      <section className="band-bone">
        <div className="container-x grid gap-8 py-14 sm:py-24 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <Seal />
            <p className="label mt-5">Our name</p>
          </div>
          <div className="max-w-3xl">
            <p className="font-display text-[clamp(26px,3.5vw,48px)] font-light leading-[1.2] text-ink">{NOTE_PARAGRAPHS[0]}</p>
            <p className="mt-8 max-w-2xl text-base leading-7 text-muted">{NOTE_PARAGRAPHS[1]}</p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">{NOTE_PARAGRAPHS[2]}</p>
          </div>
        </div>
      </section>

      <section className="band-dark">
        <div className="container-x grid gap-10 py-14 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-20">
          {principalImage && (
            <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
              <Image src={principalImage.src} alt={principalImage.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          )}

          <div>
            <p className="label text-mist">{site.principal.role}</p>
            <h2 className="mt-4 max-w-[10ch] font-display text-[clamp(44px,6.5vw,96px)] font-light leading-[0.98] text-bone">{site.principal.name}</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-mist sm:mt-8">
              Ar. Prachi Chirania Bhalotia leads Studio Envelope across residential interiors and architecture. The studio works across Bangalore, Ballari and Pune, bringing close attention to everyday use, material detail and each client&apos;s way of living.
            </p>
            <a href={site.principal.instagram} target="_blank" rel="noopener noreferrer" className="link-underline mt-6 inline-flex py-2 text-lg text-bone sm:mt-8">
              {site.principal.instagramHandle}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
