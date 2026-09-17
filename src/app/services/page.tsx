import "./services.css";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Plus } from "lucide-react";
import PageHero from "@/components/PageHero";
import RevealOnScroll from "@/components/RevealOnScroll";
import { categories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Services",
  description:
    "How Studio Envelope works across architecture, interior design, art and installations, and turnkey execution — from a first conversation through to handover.",
};

const SERVICES = [
  {
    title: "Architecture",
    promise: "A building that responds to where it stands.",
    text: "From the first sketch to the final structure, we design homes and places around their surroundings, natural light and the people who use them. Every plan starts with the site and the brief, not a template.",
    deliverables: [
      "Site and brief analysis",
      "Concept design and spatial planning",
      "Construction and structural drawing sets",
      "Coordination with structural and MEP consultants",
      "Site visits through construction",
    ],
    tags: "New builds / Renovations / Spatial planning",
  },
  {
    title: "Interior design",
    promise: "One material language, carried through every room.",
    text: "A complete interior built around your daily rituals rather than room by room. Materials, bespoke joinery, furniture and light are considered together, so the whole space reads as one idea.",
    deliverables: [
      "Space planning and layout",
      "Material, finish and colour palettes",
      "Bespoke furniture and joinery design",
      "Lighting design",
      "Vendor and craftsperson coordination",
    ],
    tags: "Residential / Commercial / Hospitality",
  },
  {
    title: "Art & installations",
    promise: "One gesture, placed where it matters most.",
    text: "Site-specific pieces that give a space its own identity — jaali screens, sculptural partitions and material studies developed in collaboration with craftspeople, not picked from a catalogue.",
    deliverables: [
      "Concept and material studies",
      "Collaboration with craftspeople and fabricators",
      "Screens, sculptural partitions and inlay work",
      "Scale mock-ups and material samples",
      "Installation on site",
    ],
    tags: "Sculpture / Screens / Material explorations",
  },
  {
    title: "Turnkey & styling",
    promise: "Design, carried through to move-in day.",
    text: "We stay involved past the drawings, coordinating the details on site and bringing the final layers together — so the space that gets handed over is the one that was designed.",
    deliverables: [
      "Execution and on-site coordination",
      "Procurement and vendor management",
      "Furniture, art and accessory styling",
      "Snagging and quality checks",
      "Final styling before handover",
    ],
    tags: "Execution / Coordination / Finishing touches",
  },
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
      <PageHero eyebrow="What we do" title="Considered spaces, carried end to end.">
        Four ways we work — architecture, interiors, art and turnkey execution — built on the
        same idea: material, light and the people who&rsquo;ll use the space, considered
        together from the very first conversation.
      </PageHero>

      <section className="svc-services page-gutter">
        <RevealOnScroll className="section-heading">
          <div>
            <p className="micro-label">01 / What we offer</p>
            <h2>
              Four disciplines.
              <br />
              One studio.
            </h2>
          </div>
        </RevealOnScroll>

        <div className="svc-service-list">
          {SERVICES.map((service, i) => (
            <RevealOnScroll key={service.title} delay={i * 0.06} className="svc-service">
              <div className="svc-service-head">
                <span className="svc-service-number" aria-hidden="true">
                  0{i + 1}
                </span>
                <div>
                  <h3>{service.title}</h3>
                  <p className="svc-service-promise">{service.promise}</p>
                </div>
              </div>
              <div className="svc-service-body">
                <p>{service.text}</p>
                <ul className="svc-deliverables">
                  {service.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <span className="svc-service-tags">{service.tags}</span>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="svc-process page-gutter">
        <RevealOnScroll className="section-heading">
          <div>
            <p className="micro-label">02 / How we work</p>
            <h2>
              From first conversation
              <br />
              to handover.
            </h2>
          </div>
        </RevealOnScroll>

        <ol className="svc-process-list">
          {PROCESS.map((step, i) => (
            <li key={step.title}>
              <RevealOnScroll delay={i * 0.06} className="svc-process-item">
                <span className="svc-process-step" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </RevealOnScroll>
            </li>
          ))}
        </ol>
      </section>

      <section className="svc-areas page-gutter">
        <RevealOnScroll className="section-heading">
          <div>
            <p className="micro-label">03 / Practice areas</p>
            <h2>
              Where these services
              <br />
              come together.
            </h2>
          </div>
          <Link href="/projects" className="line-link">
            See the work <ArrowUpRight size={20} />
          </Link>
        </RevealOnScroll>

        <div className="svc-areas-row">
          {categories.map((category, i) => (
            <RevealOnScroll key={category.slug} delay={i * 0.05}>
              <Link href={`/projects/category/${category.slug}`} className="svc-area-link">
                <h3 className="svc-area-name">{category.name}</h3>
                <span className="svc-area-tagline">{category.tagline}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="svc-faq page-gutter">
        <RevealOnScroll className="section-heading">
          <div>
            <p className="micro-label">04 / What to expect</p>
            <h2>
              Questions we hear
              <br />
              before we start.
            </h2>
          </div>
        </RevealOnScroll>

        <div className="svc-faq-list">
          {FAQS.map((faq, i) => (
            <RevealOnScroll key={faq.q} delay={i * 0.05}>
              <details className="svc-faq-item">
                <summary>
                  <h3>{faq.q}</h3>
                  <Plus size={20} className="svc-faq-icon" aria-hidden="true" />
                </summary>
                <p>{faq.a}</p>
              </details>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="svc-cta page-gutter">
        <RevealOnScroll className="svc-cta-inner">
          <p className="micro-label">05 / Start here</p>
          <h2>
            Have a space
            <br />
            in mind?
          </h2>
          <Link href="/contact" className="line-link">
            Start a conversation <ArrowUpRight size={20} />
          </Link>
        </RevealOnScroll>
      </section>
    </>
  );
}
