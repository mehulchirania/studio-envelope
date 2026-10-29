import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { findImage } from "@/lib/content/images";
import { site } from "@/lib/content/site";
import { getProjects } from "@/lib/data";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import PageTransition from "@/components/layout/PageTransition";

export const metadata: Metadata = pageMetadata({
  title: "About — Ar. Prachi Chirania",
  description:
    "Studio Envelope is an architecture and interior design practice in Bangalore, led by Principal Architect Ar. Prachi Chirania. Residential and commercial projects across India.",
  path: "/about",
});

const NOTE_PARAGRAPHS = [
  'The name "Studio Envelope" evokes warmth, authenticity and intentionality. Our studio delivers spaces that are thoughtful and personal, much like the cherished messages enclosed in an envelope. We create cohesive spaces with design solutions that blend creativity, precision and purpose—wrapped with care and shaped around each client\'s personality and needs. Innovative thinking and meticulous planning bring function and aesthetics into harmony, creating spaces that feel considered, personal and easy to live in.',
  "We get involved in the demolition & construction, electricals, plumbing, false ceiling, flooring, fixed carpentry, loose furniture & styling. We do not follow any specific style and are open to take up new challenges in terms of design direction. We like to create spaces along the preferred design language of the client, unless they are open to giving us a free hand.",
  "To maintain a specific quality we take on a limited number of projects in a year. We take up projects pan-India.",
];

export default async function AboutPage() {
  const projects = await getProjects();
  const james = projects.find((project) => project.slug === "james-residence");
  const heroImage = findImage(james, "living.jpg");
  const principalImage =
    findImage(james, "master-bedroom-2.jpg") ??
    findImage(james, "master-bedroom-1.jpg") ??
    projects[0]?.rooms[0]?.images[0] ?? {
      src: "/images/projects/james-residence/master-bedroom-1.jpg",
      alt: "Ar. Prachi Chirania — Principal Architect",
      width: 1071,
      height: 1499,
      kind: "photo" as const,
    };

  return (
    <PageTransition>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ])}
      />
      <PageHero title="Why an envelope?" background={heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined} />

      <section className="band-bone">
        <div className="container-x py-14 sm:py-24">
          <h2 className="font-display text-[clamp(36px,4vw,52px)] font-light leading-none text-ink">Our name</h2>
          {/* Newspaper columns, so the three paragraphs flow and the columns end level. */}
          <div className="mt-8 text-left text-base leading-7 text-muted sm:mt-12 md:columns-2 md:gap-12 lg:columns-3">
            {NOTE_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph} className="mb-6">
                {paragraph}
              </p>
            ))}
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
            <h2 className="mt-4 font-display text-[clamp(28px,2.7vw,44px)] font-light leading-tight text-bone lg:whitespace-nowrap">{site.principal.name}</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-mist">
              leads Studio Envelope across residential &amp; commercial interiors and architecture. The studio is based out of Bangalore &amp; provides services pan India, bringing close attention to everyday use, material detail and each client&apos;s taste. Every project is treated as its own, never a repeat of the last.
            </p>
            <a href={site.principal.instagram} target="_blank" rel="noopener noreferrer" className="link-underline mt-8 inline-flex py-2 text-lg text-bone">
              {site.principal.instagramHandle}
            </a>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
