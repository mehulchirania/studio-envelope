import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/contact/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import { findImage } from "@/lib/content/images";
import { site } from "@/lib/content/site";
import { getProjects } from "@/lib/data";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import PageTransition from "@/components/layout/PageTransition";

export const metadata: Metadata = pageMetadata({
  title: "Contact — Architecture & Interior Design Studio, Bangalore",
  description:
    "Get in touch with Studio Envelope to discuss a residential architecture or interior design project in Bangalore, Ballari or Pune.",
  path: "/contact",
});

const DETAILS = [
  { label: "Phone", value: site.contact.phone, href: site.contact.phoneHref, external: false },
  { label: "WhatsApp", value: "Message us", href: site.contact.whatsapp, external: true },
  { label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}`, external: false },
  { label: "Instagram", value: site.socials.instagramHandle, href: site.socials.instagram, external: true },
  { label: "Studio", value: site.contact.location, href: undefined, external: false },
];

export default async function ContactPage() {
  const projects = await getProjects();
  const bg =
    findImage(projects.find((p) => p.slug === "james-residence"), "living.jpg") ??
    projects[0]?.rooms[0]?.images[0] ?? {
      src: "/images/projects/james-residence/living.jpg",
      alt: "",
      width: 1650,
      height: 1795,
      kind: "photo" as const,
    };

  return (
    <PageTransition>
    <div className="grid lg:min-h-screen lg:grid-cols-2">
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ])}
      />

      <div className="band-dark relative flex flex-col justify-end overflow-hidden pb-12 pt-28 sm:pb-16 sm:pt-40 lg:min-h-screen">
        {bg && (
          <>
            <Image src={bg.src} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" priority className="absolute inset-0 -z-20 object-cover opacity-25" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/85 to-night/70" />
          </>
        )}
        <div className="container-x lg:px-[clamp(16px,4vw,48px)]">
          <h1 className="display-xl text-bone">Write to us.</h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-mist sm:mt-6">
            Tell us about your space, scope and timeline — we&apos;ll reply within a couple of working days.
          </p>

          <dl className="mt-10 flex flex-col sm:mt-14">
            {DETAILS.map((detail) => (
              <div key={detail.label} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-hairline-light py-4">
                <dt className="label w-24 shrink-0 text-mist">{detail.label}</dt>
                <dd className="min-w-0">
                  {detail.href ? (
                    <a
                      href={detail.href}
                      target={detail.external ? "_blank" : undefined}
                      rel={detail.external ? "noopener noreferrer" : undefined}
                      className="link-underline break-all text-lg text-bone sm:text-2xl"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <span className="text-lg text-bone sm:text-2xl">{detail.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="band-bone flex flex-col justify-center px-[clamp(16px,4vw,48px)] py-12 sm:py-16">
        <div className="mx-auto w-full max-w-xl">
          <h2 className="label mb-6 text-muted sm:mb-8">Tell us about your project</h2>
          <ContactForm />
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
