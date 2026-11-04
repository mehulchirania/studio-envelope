import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/contact/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import { site } from "@/lib/content/site";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import PageTransition from "@/components/layout/PageTransition";

export const metadata: Metadata = pageMetadata({
  title: "Contact: Architecture & Interior Design Studio",
  description:
    "Get in touch with Studio Envelope to discuss an architecture or interior design project anywhere in India. The studio is based in Bangalore.",
  path: "/contact",
});

const DETAILS = [
  { label: "Phone", value: site.contact.phone, href: site.contact.phoneHref, external: false },
  { label: "WhatsApp", value: "Message us", href: site.contact.whatsapp, external: true },
  { label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}`, external: false },
  { label: "Instagram", value: site.socials.instagramHandle, href: site.socials.instagram, external: true },
  { label: "Studio", value: site.contact.location, href: undefined, external: false },
];

export default function ContactPage() {
  return (
    <PageTransition>
    <div className="grid lg:min-h-screen lg:grid-cols-2">
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ])}
      />

      {/* `isolate` keeps the negative z-index photo above this band's own background. */}
      <div className="band-dark relative isolate flex flex-col justify-end overflow-hidden pb-12 pt-28 sm:pb-16 sm:pt-40 lg:min-h-screen lg:justify-start lg:pt-32">
        <Image src="/images/site/niche-wall.jpg" alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" priority className="absolute inset-0 -z-20 object-cover opacity-25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/85 to-black/70" />
        <div className="container-x lg:px-[clamp(16px,4vw,48px)]">
          <h1 className="h1 text-[clamp(44px,5vw,72px)] text-bone">Write to us.</h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-mist sm:mt-6">
            Tell us about your space, scope and timeline. We&apos;ll reply within a couple of working days.
          </p>

          <dl className="mt-10 flex flex-col sm:mt-14">
            {DETAILS.map((detail) => (
              <div key={detail.label} className="flex flex-col gap-1 border-t border-hairline-light py-4 sm:flex-row sm:items-baseline sm:gap-x-4">
                <dt className="label w-24 shrink-0 text-mist">{detail.label}</dt>
                <dd className="min-w-0">
                  {detail.href ? (
                    <a
                      href={detail.href}
                      target={detail.external ? "_blank" : undefined}
                      rel={detail.external ? "noopener noreferrer" : undefined}
                      className="link-underline break-words py-1 text-lg text-bone sm:text-2xl"
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

      <div className="band-bone flex flex-col justify-start px-[clamp(16px,4vw,48px)] pb-12 pt-12 sm:pb-16 sm:pt-16 lg:pt-28">
        <div className="mx-auto w-full max-w-xl">
          <div className="relative mb-8 aspect-[3/2] w-full overflow-hidden bg-paper-2 sm:mb-10">
            <Image src="/images/site/reading-corner.jpg" alt="Sitting corner with two upholstered armchairs, a chess table and a built in bookshelf" fill sizes="(max-width: 1024px) 100vw, 36rem" className="object-cover" />
          </div>
          <h2 className="label mb-6 text-muted sm:mb-8">Tell us about your project</h2>
          <ContactForm />
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
