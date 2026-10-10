import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import ServiceGroup from "@/components/services/ServiceGroup";
import FaqItem from "@/components/services/FaqItem";
import ProcessStep from "@/components/services/ProcessStep";
import JsonLd from "@/components/seo/JsonLd";
import { faqs, processSteps, serviceDescriptions, serviceGroups, serviceImages } from "@/lib/content/services";
import { findImage } from "@/lib/content/images";
import { getProjects } from "@/lib/data";
import { getBreadcrumbSchema, getFaqSchema, pageMetadata } from "@/lib/seo";
import PageTransition from "@/components/layout/PageTransition";

export const metadata: Metadata = pageMetadata({
  title: "Architecture & Interior Design Services in Bangalore",
  description:
    "Space planning, design consultation, material selection, furnishing, styling and project management for homes in Bangalore, Ballari and Pune by Studio Envelope.",
  path: "/services",
});

export default async function ServicesPage() {
  const projects = await getProjects();
  const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
  const doshi = bySlug("doshi-residence");

  const heroImage = findImage(doshi, "living-dining-1.jpg") ?? projects[0]?.rooms[0]?.images[0];

  return (
    <PageTransition>
      <JsonLd schema={getFaqSchema(faqs)} />
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ])}
      />

      <PageHero title="Everything a home needs, in one studio." background={heroImage ? { src: heroImage.src, alt: heroImage.alt } : undefined}>
        From the first consultation to the final photo shoot, we carry every layer of a project — design, furnishing and delivery — under one roof.
      </PageHero>

      <section className="band-bone section-y">
        <div className="container-x">
          <SectionHeader seal heading="Ten services, three stages." className="mb-8 sm:mb-10" />

          {/* Jump links: the three stages and how many services each holds. */}
          <nav aria-label="Service stages" className="mb-12 flex flex-wrap gap-3 sm:mb-16">
            {serviceGroups.map((group, i) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="label inline-flex min-h-11 items-center gap-3 border border-hairline px-4 py-3 text-ink transition-colors hover:bg-ink hover:text-bone"
              >
                <span className="opacity-60">{String(i + 1).padStart(2, "0")}</span>
                {group.name}
                <span className="opacity-60">{group.items.length} services</span>
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-14 sm:gap-20">
            {serviceGroups.map((group, groupIndex) => {
              // Services are numbered 01-10 straight through, across the stages.
              const before = serviceGroups.slice(0, groupIndex).reduce((total, g) => total + g.items.length, 0);
              return (
                <ServiceGroup
                  key={group.id}
                  id={group.id}
                  number={String(groupIndex + 1).padStart(2, "0")}
                  name={group.name}
                  blurb={group.blurb}
                  services={group.items.map((item, i) => ({
                    number: String(before + i + 1).padStart(2, "0"),
                    name: item,
                    description: serviceDescriptions[item],
                    image: serviceImages[item],
                  }))}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="band-teal section-y">
        <div className="container-x">
          <SectionHeader heading="Two ways we take on a project." tone="dark" className="mb-10 sm:mb-14" />
          <div className="grid gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <h3 className="font-display text-2xl text-bone">Interior design</h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-bone/90">
                Interiors planned and detailed within an existing shell — space planning, material and furniture selection, styling and delivery, without touching the building itself.
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl text-bone">Architecture &amp; interiors</h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-bone/90">
                Renovations and additions that span both the built form and the interiors within it. Shyamkutir, our Ballari bungalow renovation, is one example.{" "}
                <Link href="/projects/shyamkutir" className="link-underline text-bone">
                  View project <ArrowUpRight size={14} className="inline" aria-hidden="true" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="band-dark section-y">
        <div className="container-x">
          <SectionHeader heading="From first conversation to handover." tone="dark" className="mb-10 sm:mb-14" />
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
            {processSteps.map((step, i) => (
              <ProcessStep key={step.title} number={String(i + 1).padStart(2, "0")} title={step.title} text={step.text} />
            ))}
          </ol>
        </div>
      </section>

      <section className="band-bone section-y">
        <div className="container-x">
          <SectionHeader heading="Questions we hear before we start." className="mb-8 sm:mb-14" />
          <div className="max-w-3xl border-t border-hairline">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="band-bone border-t border-hairline py-12">
        <div className="container-x">
          <Link href="/contact" className="link-arrow link-underline py-2 text-xl">
            Have a space in mind? Write to us <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
