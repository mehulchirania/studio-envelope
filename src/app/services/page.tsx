import type { Metadata } from "next";
import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import RevealOnScroll from "@/components/RevealOnScroll";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: "How Studio Envelope works, from first consultation to final styling.",
};

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  "Design Consultation": "An initial walkthrough of your space and brief to set the direction for the project.",
  "Space Planning": "Working out how each room is used and laid out, before any material or furniture decision.",
  "Colour Consultation": "A palette for walls, ceilings and trims chosen to suit light, material and mood.",
  "Lighting Consultation": "A lighting layout — ambient, task and accent — planned alongside the electrical drawings.",
  "Material Selection": "Flooring, wall finishes, countertops and hardware chosen to work together and wear well.",
  "Furniture Selection": "Sourcing and specifying furniture that fits the plan, the budget and the material palette.",
  "Soft Furnishing": "Curtains, upholstery, rugs and linens selected to complete the space.",
  "Décor Consultation": "Art, accessories and styling details that finish a room once the larger pieces are in place.",
  "Project Management": "Coordinating vendors, contractors and timelines so the design is executed as drawn.",
  "Photo & Video Shoot": "Professional documentation of the finished space once the project is complete.",
};

const GROUPS = [
  { name: "Design", items: services.design },
  { name: "Furnish & Style", items: services.furnishAndStyle },
  { name: "Deliver", items: services.deliver },
];

const PROCESS = [
  {
    title: "Discover",
    text: "We start by understanding the site, the brief and how you actually want to live or work in the space.",
  },
  {
    title: "Concept",
    text: "That understanding becomes an initial spatial and material direction for you to react to.",
  },
  {
    title: "Design development",
    text: "The concept is refined into drawings, material palettes and details that are ready to build.",
  },
  {
    title: "Execution",
    text: "We coordinate the trades, craftspeople and vendors who bring the design onto the site.",
  },
  {
    title: "Handover",
    text: "We walk the finished space with you and settle the last details before you move in.",
  },
];

const FAQS = [
  {
    q: "How does a project usually start?",
    a: "With a conversation about the site, the brief and how you want the space to feel. From there we can talk through which of our services fit, and what a next step could look like.",
  },
  {
    q: "What should I bring to a first conversation?",
    a: "Whatever you already have — site details or drawings, photos, dimensions, references you're drawn to. It's just as useful to start with nothing more than a sense of what you want the space to feel like.",
  },
  {
    q: "Can we work together if I'm not based near the studio?",
    a: "We're set up to work at a distance for design development, with site visits arranged around the stages of a project where being there in person matters most.",
  },
  {
    q: "Can I engage you for design only, without execution?",
    a: "Yes. Some projects stop at drawings and specifications for your own contractor to build from; others carry through to turnkey execution. We scope this together based on what you need.",
  },
  {
    q: "Who manages the work on site once construction starts?",
    a: "We coordinate directly with contractors, craftspeople and vendors, and stay involved on site to keep the finished work aligned with what was designed.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero label="Services" title="Everything a home needs, in one studio.">
        From the first consultation to the final photo shoot, we carry every layer of a project — design, furnishing and delivery — under one roof.
      </PageHero>

      <section className="section-y">
        <div className="container-x">
          <SectionHeader seal label="What is included" heading="Ten services, three stages." className="mb-16" />

          <div className="grid gap-14 lg:grid-cols-3">
            {GROUPS.map((group) => (
              <RevealOnScroll key={group.name}>
                <h3 className="font-display text-2xl text-ink">{group.name}</h3>
                <ul className="mt-6">
                  {group.items.map((item) => (
                    <li key={item} className="border-t border-hairline py-5 last:border-b">
                      <p className="text-ink">{item}</p>
                      <p className="mt-1.5 text-base text-muted">{SERVICE_DESCRIPTIONS[item]}</p>
                    </li>
                  ))}
                </ul>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y border-t border-hairline bg-paper-2">
        <div className="container-x">
          <SectionHeader label="Scope" heading="Two ways we take on a project." className="mb-16" />

          <div className="grid gap-14 md:grid-cols-2">
            <RevealOnScroll>
              <h3 className="font-display text-2xl text-ink">Interior design</h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                Interiors planned and detailed within an existing shell — space planning, material and furniture
                selection, styling and delivery, without touching the building itself.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.06}>
              <h3 className="font-display text-2xl text-ink">Architecture & interiors</h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                Renovations and additions that span both the built form and the interiors within it. Shyamkutir, our
                Ballari bungalow renovation, is one example.{" "}
                <Link href="/projects/shyamkutir" className="link-arrow">
                  View project <ArrowUpRight size={14} />
                </Link>
              </p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <SectionHeader label="How we work" heading="From first conversation to handover." className="mb-16" />

          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((step, i) => (
              <li key={step.title}>
                <RevealOnScroll delay={i * 0.06}>
                  <span className="label text-teal">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-xl text-ink">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted">{step.text}</p>
                </RevealOnScroll>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y border-t border-hairline bg-paper-2">
        <div className="container-x">
          <SectionHeader label="FAQ" heading="Questions we hear before we start." className="mb-16" />

          <div className="max-w-3xl">
            {FAQS.map((faq, i) => (
              <RevealOnScroll key={faq.q} delay={i * 0.05}>
                <details className="group border-b border-hairline py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden">
                    <h3 className="font-display text-xl text-ink">{faq.q}</h3>
                    <Plus size={18} className="shrink-0 text-teal transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
                  </summary>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{faq.a}</p>
                </details>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y border-t border-hairline">
        <div className="container-x">
          <Link href="/contact" className="link-arrow text-xl">
            Have a space in mind? Write to us <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
