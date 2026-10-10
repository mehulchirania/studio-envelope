import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { site } from "@/lib/content/site";

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

const expertiseList = [
  "Residential Architecture",
  "Turnkey Interior Design",
  "Space Planning & Renovation",
  "Custom Furniture & Styling",
  "Material & Lighting Design",
];

const studioLocations = [
  { city: "Bangalore", note: "Head Studio & Practice" },
  { city: "Ballari", note: "Residential Projects" },
  { city: "Pune", note: "Design Consultations" },
];

/** Closing band on every public page: an invitation to connect, studio scope, locations, legal links, and copyright. */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="band-darkest border-t border-hairline-light/50">
      <div className="container-x section-y">
        {/* Top invitation row */}
        <div className="flex flex-col items-start gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label text-marigold">Have a space in mind?</p>
            <h2 className="display-xl mt-4 max-w-3xl text-bone">Write to us.</h2>
          </div>
          <Button variant="round" href="/contact" className="label h-32 w-32 shrink-0">
            Enquire
            <ArrowUpRight size={18} />
          </Button>
        </div>

        {/* Structured studio info columns */}
        <div className="mt-16 grid gap-10 border-t border-hairline-light pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Studio Identity */}
          <div className="space-y-4">
            <p className="label text-marigold">The Practice</p>
            <p className="text-base leading-relaxed text-bone/90">
              Architecture and bespoke interiors crafted with warmth, precision, and purpose.
            </p>
            <div className="pt-2 text-sm text-mist">
              <p className="font-medium text-bone">{site.principal.name}</p>
              <p>{site.principal.role}</p>
            </div>
          </div>

          {/* Col 2: Scope of Work */}
          <div className="space-y-4">
            <p className="label text-marigold">Expertise</p>
            <ul className="space-y-2 text-sm text-mist">
              {expertiseList.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-marigold/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Studio Locations */}
          <div className="space-y-4">
            <p className="label text-marigold">Studio &amp; Presence</p>
            <div className="space-y-3 text-sm">
              {studioLocations.map((loc) => (
                <div key={loc.city}>
                  <p className="font-medium text-bone">{loc.city}</p>
                  <p className="text-xs text-mist">{loc.note}</p>
                </div>
              ))}
            </div>
            <p className="pt-2 text-xs text-mist/80">
              Hours: Mon – Sat, 10:00 AM – 7:00 PM IST
            </p>
          </div>

          {/* Col 4: Direct Inquiries & Social */}
          <div className="space-y-4">
            <p className="label text-marigold">Inquiries</p>
            <div className="flex flex-col space-y-2 text-sm">
              <a
                href={`mailto:${site.contact.email}`}
                className="link-underline inline-block break-all text-bone"
              >
                {site.contact.email}
              </a>
              <a
                href={site.contact.phoneHref}
                className="link-underline inline-block text-bone"
              >
                {site.contact.phone}
              </a>
              <a
                href={site.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-block text-bone"
              >
                WhatsApp Message
              </a>
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-block text-bone"
              >
                Instagram {site.socials.instagramHandle}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom utility bar */}
      <div className="container-x flex flex-col items-start gap-6 border-t border-hairline-light py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <Link href="/" aria-label="Studio Envelope home">
            <Logo variant="light" />
          </Link>
          <span className="hidden text-mist/40 sm:inline">|</span>
          <p className="text-xs text-mist">
            © {currentYear} Studio Envelope. All rights reserved.
          </p>
        </div>

        {/* Legal links (generic privacy policy & legal stuff) */}
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-mist" aria-label="Legal and Policy">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-mist transition-colors hover:text-marigold"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="link-underline text-mist transition-colors hover:text-marigold"
          >
            Direct Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
