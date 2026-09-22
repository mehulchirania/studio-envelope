import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import Marquee from "@/components/motion/Marquee";
import HorizontalGallery from "@/components/motion/HorizontalGallery";
import Seal from "@/components/Seal";
import ServiceGroup from "@/components/studio/ServiceGroup";
import FaqItem from "@/components/studio/FaqItem";
import ProcessCard from "@/components/studio/ProcessCard";
import { getProjects } from "@/lib/data";
import { services } from "@/lib/site";
import type { Project } from "@/lib/types";

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

const ALL_SERVICES = [...services.design, ...services.furnishAndStyle, ...services.deliver];

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

function findImage(project: Project | undefined, filename: string) {
  return project?.rooms.flatMap((room) => room.images).find((img) => img.src.endsWith(filename));
}

export default async function ServicesPage() {
  const projects = await getProjects();
  const james = projects.find((p) => p.slug === "james-residence");
  const shyamkutir = projects.find((p) => p.slug === "shyamkutir");
  const doshi = projects.find((p) => p.slug === "doshi-residence");

  const heroImage = findImage(doshi, "living-dining-1.jpg");
  const groupImages = [findImage(shyamkutir, "tv-unit.jpg"), findImage(james, "master-bedroom-1.jpg"), findImage(doshi, "living-dining-1.jpg")];

  const startIndices = GROUPS.reduce<number[]>((acc, group, i) => {
    acc.push(i === 0 ? 1 : acc[i - 1] + GROUPS[i - 1].items.length);
    return acc;
  }, []);

  return (
    <>
      <PageHero
        label="Services"
        title="Everything a home needs, in one studio."
        background={heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined}
      >
        From the first consultation to the final photo shoot, we carry every layer of a project — design, furnishing
        and delivery — under one roof.
      </PageHero>

      {/* 10 services, grouped */}
      <section className="band-bone section-y">
        <div className="container-x">
          <SectionHeader seal label="What is included" heading="Ten services, three stages." className="mb-14" />

          <div className="flex flex-col gap-14">
            {GROUPS.map((group, gi) => {
              const startIndex = startIndices[gi];
              const image = groupImages[gi];
              return (
                <ServiceGroup
                  key={group.name}
                  name={group.name}
                  startIndex={startIndex}
                  rows={group.items.map((item) => ({ name: item, description: SERVICE_DESCRIPTIONS[item] }))}
                  image={image ?? { src: "/images/projects/james-residence/kitchen-dining.jpg", alt: group.name, width: 1483, height: 988 }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Marquee ribbon */}
      <section className="band-dark border-y border-hairline-light py-8">
        <Marquee speed={28}>
          {ALL_SERVICES.map((s, i) => (
            <span key={`${s}-${i}`} className="flex items-center gap-8">
              <span className="font-display text-3xl font-light text-bone sm:text-4xl">{s}</span>
              <Seal tone="dark" />
            </span>
          ))}
        </Marquee>
      </section>

      {/* Scope */}
      <section className="band-teal section-y">
        <div className="container-x">
          <SectionHeader label="Scope" heading="Two ways we take on a project." tone="dark" className="mb-16" />
          <div className="grid gap-14 md:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl text-bone">Interior design</h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-mist">
                Interiors planned and detailed within an existing shell — space planning, material and furniture
                selection, styling and delivery, without touching the building itself.
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl text-bone">Architecture &amp; interiors</h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-mist">
                Renovations and additions that span both the built form and the interiors within it. Shyamkutir, our
                Ballari bungalow renovation, is one example.{" "}
                <Link href="/projects/shyamkutir" className="link-underline text-bone">
                  View project <ArrowUpRight size={14} className="inline" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="band-dark section-y">
        <div className="container-x mb-14">
          <SectionHeader label="How we work" heading="From first conversation to handover." tone="dark" />
        </div>
        <div className="container-x lg:px-0">
          <HorizontalGallery
            className="lg:pl-[clamp(16px,3vw,48px)]"
            items={PROCESS.map((step, i) => (
              <ProcessCard key={step.title} number={String(i + 1).padStart(2, "0")} title={step.title} text={step.text} />
            ))}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="band-bone section-y">
        <div className="container-x">
          <SectionHeader label="FAQ" heading="Questions we hear before we start." className="mb-14" />
          <div className="max-w-3xl">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="band-bone border-t border-hairline py-14">
        <div className="container-x">
          <Link href="/contact" className="link-arrow link-underline text-xl">
            Have a space in mind? Write to us <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
