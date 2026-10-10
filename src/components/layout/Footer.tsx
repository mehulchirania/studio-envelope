import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { site } from "@/lib/content/site";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "Studio" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const contactColumns = [
  { label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}`, external: false },
  { label: "Phone", value: site.contact.phone, href: site.contact.phoneHref, external: false },
  { label: "WhatsApp", value: "Message us", href: site.contact.whatsapp, external: true },
  { label: "Instagram", value: site.socials.instagramHandle, href: site.socials.instagram, external: true },
];

/** Closing band on every public page: an invitation to write, contact details, nav and copyright. */
export default function Footer() {
  return (
    <footer className="band-darkest">
      <div className="container-x section-y">
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

        <div className="mt-16 grid gap-8 border-t border-hairline-light pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {contactColumns.map((item) => (
            <div key={item.label}>
              <p className="label text-marigold">{item.label}</p>
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="link-underline mt-1 inline-block break-all py-3 text-lg text-bone sm:mt-2 sm:py-1"
              >
                {item.value}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-12 text-sm text-mist">{site.contact.location}</p>
      </div>

      <div className="container-x flex flex-col items-start gap-6 border-t border-hairline-light py-8 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" aria-label="Studio Envelope home">
          <Logo variant="light" />
        </Link>
        <nav className="flex flex-wrap gap-x-6" aria-label="Footer">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="label link-underline py-3 text-bone">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="label text-mist">© {new Date().getFullYear()} Studio Envelope</p>
      </div>
    </footer>
  );
}
