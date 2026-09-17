import type { Metadata } from "next";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { site } from "@/lib/site";
import PageHero from "@/components/PageHero";
import RevealOnScroll from "@/components/RevealOnScroll";
import ContactForm from "@/components/ContactForm";
import { InstagramIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Studio Envelope to discuss your next architecture or interior design project.",
};

const CONTACT_ITEMS = [
  { icon: Phone, label: "Call", value: site.contact.phone, href: site.contact.phoneHref },
  { icon: MessageCircle, label: "WhatsApp", value: "Message us", href: site.contact.whatsapp },

  {
    icon: InstagramIcon,
    label: "Instagram",
    value: "@studio__envelope",
    href: site.socials.instagram,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Get in touch" title="Let's start a conversation">
        Tell us a little about your project — space, scope and timeline — and
        we&apos;ll get back to you within a couple of business days.
      </PageHero>

      <section className="px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-[1fr_1.3fr]">
          <RevealOnScroll>
            <div className="lg:sticky lg:top-32">
              <ul className="space-y-8">
                {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-start gap-4"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-hairline text-brass transition-colors group-hover:border-brass">
                        <Icon size={18} />
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-[0.15em] text-muted">
                          {label}
                        </span>
                        <span className="mt-1 block font-display text-xl text-fg transition-colors group-hover:text-brass">
                          {value}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-hairline text-brass">
                    <MapPin size={18} />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.15em] text-muted">
                      Studio
                    </span>
                    <span className="mt-1 block font-display text-xl text-fg">
                      {site.contact.location}
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <ContactForm />
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}

