import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import Seal from "@/components/Seal";
import RevealText from "@/components/motion/RevealText";
import ScrollWords from "@/components/motion/ScrollWords";
import ParallaxImage from "@/components/motion/ParallaxImage";
import { getProjects } from "@/lib/data";
import { site } from "@/lib/site";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Studio",
  description: site.description,
};

const NOTE_PARAGRAPHS = [
  'The name "Studio Envelope" evokes warmth, authenticity, and intentionality. Our studio delivers spaces that are thoughtful and personal, much like the cherished messages enclosed in an envelope.',
  "At our studio, we embrace this symbolism by creating cohesive spaces with innovative design solutions that seamlessly blend creativity, precision, and purpose — wrapped with love and passion, reflecting your unique personality and needs.",
  "We focus on innovative thinking and meticulous planning to ensure harmony between functionality and aesthetics. Through our work, we create spaces that feel like heartfelt messages — crafted with care to bring joy.",
];

const APPROACH = [
  {
    title: "Thoughtful & personal",
    text: "Every space is treated like a message written for the people who'll live in it — considered, not templated.",
  },
  {
    title: "Innovative thinking, meticulous planning",
    text: "Creative solutions are grounded in careful planning, so ideas hold up from first sketch to final detail.",
  },
  {
    title: "Function in harmony with aesthetics",
    text: "A space has to work before it can feel beautiful — the two are designed together, not traded off.",
  },
];

/** Finds a room image by matching the end of its filename. */
function findImage(project: Project | undefined, filename: string) {
  return project?.rooms.flatMap((room) => room.images).find((img) => img.src.endsWith(filename));
}

export default async function AboutPage() {
  const projects = await getProjects();
  const james = projects.find((p) => p.slug === "james-residence");
  const shyamkutir = projects.find((p) => p.slug === "shyamkutir");
  const polas = projects.find((p) => p.slug === "polas-residence");
  const doshi = projects.find((p) => p.slug === "doshi-residence");

  const heroImage = findImage(james, "living.jpg");
  const principalImage = findImage(james, "master-bedroom-2.jpg") ?? findImage(james, "master-bedroom-1.jpg");

  const strip = [
    { project: james, filename: "kitchen-dining.jpg" },
    { project: shyamkutir, filename: "tv-unit.jpg" },
    { project: polas, filename: "kitchen-dining.jpg" },
    { project: doshi, filename: "stair-puja.jpg" },
  ]
    .map(({ project, filename }) => ({ project, image: findImage(project, filename) }))
    .filter((entry): entry is { project: Project; image: NonNullable<ReturnType<typeof findImage>> } => Boolean(entry.project && entry.image));

  return (
    <>
      <PageHero
        label="The studio"
        title="Why an envelope?"
        background={heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined}
      >
        A note on what the name means, and how it shapes the way we design.
      </PageHero>

      {/* Letter */}
      <section className="band-bone section-y">
        <div className="container-x">
          <Seal className="mb-10" />
          <div className="mx-auto max-w-[62ch]">
            <ScrollWords
              text={NOTE_PARAGRAPHS[0]}
              className="font-display text-[24px] leading-[1.45] text-ink sm:text-[30px] [&_span]:!text-ink"
            />
            <p className="mt-8 text-base leading-relaxed text-muted">{NOTE_PARAGRAPHS[1]}</p>
            <p className="mt-6 text-base leading-relaxed text-muted">{NOTE_PARAGRAPHS[2]}</p>
            <p className="mt-10 font-display text-xl italic text-teal">
              — {site.principal.name}, {site.principal.role}
            </p>
          </div>
        </div>
      </section>

      {/* Principal */}
      <section className="band-dark section-y">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="label mb-6">Principal architect</p>
            <h2 className="display-xl text-bone">
              <RevealText as="span" split="lines" text={site.principal.name} />
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-mist">
              Ar. Prachi Chirania Bhalotia leads Studio Envelope, working across residential interiors and
              architecture. The studio&apos;s projects span Bangalore, Ballari and Pune.
            </p>
            <a
              href={site.principal.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-8 inline-flex text-lg text-bone"
            >
              {site.principal.instagramHandle}
            </a>
          </div>

          {principalImage && james && (
            <div className="lg:col-span-5">
              <ParallaxImage
                src={principalImage.src}
                alt={principalImage.alt}
                width={principalImage.width}
                height={principalImage.height}
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="aspect-[3/4] w-full"
              />
              <p className="label mt-4 text-mist">
                {james.title} — {james.location}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Approach */}
      <section className="band-teal section-y">
        <div className="container-x">
          <SectionHeader label="Approach" heading="How the note reads, in practice." tone="dark" className="mb-16" />
          <div className="grid gap-12 sm:grid-cols-3">
            {APPROACH.map((point, i) => (
              <div key={point.title}>
                <span className="font-display text-5xl font-light text-marigold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 font-display text-2xl text-bone">{point.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-mist">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing strip */}
      {strip.length > 0 && (
        <section className="band-darkest">
          <Link href="/projects" aria-label="View all projects" className="group block">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {strip.map(({ project, image }) => (
                <div key={project.id} className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
            <div className="container-x flex items-center justify-between py-8">
              <p className="label text-mist">Selected work</p>
              <span className="link-arrow link-underline text-bone">
                View all projects <ArrowUpRight size={16} />
              </span>
            </div>
          </Link>
        </section>
      )}
    </>
  );
}
