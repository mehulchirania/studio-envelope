import Image from "next/image";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { getProjects } from "@/lib/data";
import PageHero from "@/components/PageHero";
import RevealOnScroll from "@/components/RevealOnScroll";
import { InstagramIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Studio Envelope is an architecture and interior design practice led by Ar. Prachi Chirania, crafting warm, material-led spaces across India.",
};

export const revalidate = 60;

const VALUES = [
  {
    title: "Material honesty",
    description: "We choose materials for how they age and feel, not just how they photograph on day one.",
  },
  {
    title: "Restraint",
    description: "A few ideas, carried consistently through a space, read stronger than many ideas used once.",
  },
  {
    title: "Craft, kept visible",
    description: "Jaali, fluting, inlay — the hand of the maker stays legible in the finished room.",
  },
  {
    title: "Designed to be lived in",
    description: "Every plan is tested against how a family actually moves through their day.",
  },
];

const SOURCES = [
  { title: "Stone", description: "Local sandstone, marble and travertine, chosen to age and weather honestly." },
  { title: "Wood", description: "Teak, oak and cane — fluted, caned or left in the solid for warmth underfoot." },
  { title: "Jaali & cut-work", description: "Mandala and lattice screens that filter light into moving pattern." },
  { title: "Brass", description: "Unlacquered brass inlay and fixtures that are meant to develop a patina." },
  { title: "Textiles", description: "Linen, boucle and handloom cottons that soften every hard material around them." },
];

export default async function AboutPage() {
  const projects = await getProjects();
  const profileImage = projects[2]?.coverImage ?? projects[0]?.coverImage ?? "";

  return (
    <>
      <PageHero eyebrow="About the studio" title="Art, architecture, and the space between them">
        {site.description}
      </PageHero>

      {/* Philosophy */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <RevealOnScroll>
            <p className="text-lg leading-relaxed text-fg/85 sm:text-xl">
              Studio Envelope was founded on a simple belief: a space is more than
              its floor plan. It is light falling through a jaali screen at four in
              the afternoon, the grain of a fluted wall under your hand, the quiet
              you feel walking into a room where every material was chosen on
              purpose. We work across architecture, interiors and art
              installations, but the goal is always the same — to design an
              experience, not just an envelope of walls.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Principal profile */}
      <section className="border-t border-hairline px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1fr] lg:items-center">
          <RevealOnScroll>
            <div className="relative aspect-[4/5] overflow-hidden bg-surface">
              {profileImage && (
                <Image
                  src={profileImage}
                  alt="A Studio Envelope interior, representative of the principal's design language"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              )}
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="eyebrow mb-4">Creative head</p>
            <h2 className="font-display text-4xl text-fg sm:text-5xl">{site.principal.name}</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.15em] text-brass">
              {site.principal.role}
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
              Ar. Prachi Chirania is the creative head of Studio Envelope. The studio brings art, architecture and interior design together with a simple intention: “Here to design experiences.” Explore the studio journal for a closer look at the spaces and details shared by the practice.
            </p>
            <a
              href={site.principal.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-fg/85 transition-colors hover:text-brass"
            >
              <InstagramIcon size={16} />
              @prachichirania
            </a>
          </RevealOnScroll>
        </div>
      </section>

      {/* Approach / values */}
      <section className="border-t border-hairline bg-surface px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll>
            <p className="eyebrow mb-4">Our approach</p>
            <h2 className="mb-16 font-display text-4xl text-fg sm:text-5xl">What we value</h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
            {VALUES.map((value, i) => (
              <RevealOnScroll key={value.title} delay={i * 0.08}>
                <h3 className="font-display text-2xl text-fg">{value.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                  {value.description}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="border-t border-hairline px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll>
            <p className="eyebrow mb-4">Sources</p>
            <h2 className="mb-4 font-display text-4xl text-fg sm:text-5xl">
              Materials &amp; craft we love
            </h2>
            <p className="mb-16 max-w-xl text-sm text-muted">
              The recurring raw materials behind every Studio Envelope project.
            </p>
          </RevealOnScroll>
          <div className="divide-y divide-hairline border-t border-hairline">
            {SOURCES.map((source, i) => (
              <RevealOnScroll key={source.title} delay={i * 0.05}>
                <div className="flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:gap-10">
                  <h3 className="font-display text-2xl text-fg sm:w-48">{source.title}</h3>
                  <p className="max-w-xl text-sm leading-relaxed text-muted">
                    {source.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

