import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import RevealOnScroll from "@/components/RevealOnScroll";
import Seal from "@/components/Seal";
import { site } from "@/lib/site";

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

export default function AboutPage() {
  return (
    <>
      <PageHero label="The studio" title="Why an envelope?" />

      <section className="section-y">
        <div className="container-x">
          <RevealOnScroll>
            <Seal className="mb-10" />
          </RevealOnScroll>
          <div className="mx-auto max-w-[60ch]">
            <RevealOnScroll>
              <p className="font-display text-[22px] leading-[1.5] text-ink sm:text-[26px]">{NOTE_PARAGRAPHS[0]}</p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.06}>
              <p className="mt-6 text-base leading-relaxed text-ink">{NOTE_PARAGRAPHS[1]}</p>
              <p className="mt-6 text-base leading-relaxed text-ink">{NOTE_PARAGRAPHS[2]}</p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <p className="mt-10 font-display text-lg italic text-teal">
                — {site.principal.name}, {site.principal.role}
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="section-y border-t border-hairline">
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <RevealOnScroll>
            <div className="bg-paper-2 p-10 sm:p-14">
              <p className="font-display text-3xl leading-tight text-ink sm:text-4xl">{site.principal.name}</p>
              <p className="label mt-4">{site.principal.role}</p>
              <p className="label mt-2">Bangalore</p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.08}>
            <p className="max-w-xl text-base leading-relaxed text-muted">
              Ar. Prachi Chirania Bhalotia leads Studio Envelope, working across residential interiors and
              architecture. The studio&apos;s projects span Bangalore, Ballari and Pune.
            </p>
            <a
              href={site.principal.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow mt-6 inline-flex"
            >
              {site.principal.instagramHandle} <ArrowUpRight size={14} />
            </a>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section-y border-t border-hairline bg-paper-2">
        <div className="container-x">
          <SectionHeader label="Approach" heading="How the note reads, in practice." className="mb-16" />
          <div className="grid gap-10 sm:grid-cols-3">
            {APPROACH.map((point, i) => (
              <RevealOnScroll key={point.title} delay={i * 0.06}>
                <h3 className="font-display text-2xl text-ink">{point.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted">{point.text}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y border-t border-hairline">
        <div className="container-x">
          <Link href="/projects" className="link-arrow text-xl">
            See the work <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
