import type { Metadata } from "next";
import Image from "next/image";
import RevealText from "@/components/motion/RevealText";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Studio Envelope to discuss your next architecture or interior design project.",
};

const DETAILS = [
  { label: "Phone", value: site.contact.phone, href: site.contact.phoneHref },
  { label: "WhatsApp", value: "Message us", href: site.contact.whatsapp, external: true },
  { label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
  { label: "Instagram", value: site.socials.instagramHandle, href: site.socials.instagram, external: true },
  { label: "Studio", value: site.contact.location },
];

export default async function ContactPage() {
  const projects = await getProjects();
  const bg = projects.find((p) => p.slug === "james-residence")?.rooms.flatMap((r) => r.images).find((img) => img.src.endsWith("living.jpg"));

  return (
    <div className="grid lg:min-h-screen lg:grid-cols-2">
      {/* Left — night panel */}
      <div className="band-dark relative flex min-h-[80svh] flex-col justify-end overflow-hidden pt-32 pb-16 sm:pt-40 lg:min-h-screen">
        {bg && (
          <>
            <Image src={bg.src} alt="" fill sizes="50vw" className="absolute inset-0 -z-20 object-cover opacity-25" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/85 to-night/70" />
          </>
        )}
        <div className="container-x lg:px-[clamp(16px,4vw,48px)]">
          <p className="label mb-6">Contact</p>
          <h1 className="display-xl text-bone">
            <RevealText as="span" text="Write to us." />
          </h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-mist">
            Tell us about your space, scope and timeline — we&apos;ll reply within a couple of working days.
          </p>

          <dl className="mt-14 flex flex-col gap-6">
            {DETAILS.map((detail) => (
              <div key={detail.label} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-hairline-light pt-4">
                <dt className="label w-24 shrink-0 text-mist">{detail.label}</dt>
                <dd>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      target={detail.external ? "_blank" : undefined}
                      rel={detail.external ? "noopener noreferrer" : undefined}
                      className="link-underline text-xl text-bone sm:text-2xl"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <span className="text-xl text-bone sm:text-2xl">{detail.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Right — bone panel with form */}
      <div className="band-bone flex flex-col justify-center px-[clamp(16px,4vw,48px)] py-16 pt-24 sm:pt-16">
        <div className="mx-auto w-full max-w-xl">
          <p className="label mb-8 text-muted">Tell us about your project</p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
