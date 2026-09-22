import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import RevealOnScroll from "@/components/RevealOnScroll";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Studio Envelope to discuss your next architecture or interior design project.",
};

const DETAILS = [
  { label: "Studio", value: site.contact.location },
  { label: "Phone", value: site.contact.phone, href: site.contact.phoneHref },
  { label: "WhatsApp", value: "Message us", href: site.contact.whatsapp, external: true },
  { label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
  { label: "Instagram", value: site.socials.instagramHandle, href: site.socials.instagram, external: true },
];

export default function ContactPage() {
  return (
    <>
      <PageHero label="Contact" title="Write to us.">
        Tell us about your space, scope and timeline — we&apos;ll reply within a couple of working days.
      </PageHero>

      <section className="section-y">
        <div className="container-x grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <RevealOnScroll>
            <dl className="space-y-8">
              {DETAILS.map((detail) => (
                <div key={detail.label} className="border-b border-hairline pb-6">
                  <dt className="label mb-2">{detail.label}</dt>
                  <dd>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        target={detail.external ? "_blank" : undefined}
                        rel={detail.external ? "noopener noreferrer" : undefined}
                        className="text-lg text-ink hover:text-teal"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <span className="text-lg text-ink">{detail.value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </RevealOnScroll>

          <RevealOnScroll delay={0.08}>
            <ContactForm />
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
