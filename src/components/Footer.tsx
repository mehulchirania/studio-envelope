import Link from "next/link";
import Logo from "./Logo";
import { site } from "@/lib/site";

/** Teal footer band: a "Write to us." invitation, contact details, nav and
 * the copyright line. The one teal band per page, per the brief. */
export default function Footer() {
  return (
    <footer className="bg-teal text-paper">
      <div className="container-x section-y">
        <p className="label text-marigold">Have a space in mind?</p>
        <h2 className="display-xl mt-4 max-w-3xl text-paper">Write to us.</h2>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="label text-marigold">Email</p>
            <a href={`mailto:${site.contact.email}`} className="mt-2 block text-lg">
              {site.contact.email}
            </a>
          </div>
          <div>
            <p className="label text-marigold">Phone</p>
            <a href={site.contact.phoneHref} className="mt-2 block text-lg">
              {site.contact.phone}
            </a>
          </div>
          <div>
            <p className="label text-marigold">WhatsApp</p>
            <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-2 block text-lg">
              Message us
            </a>
          </div>
          <div>
            <p className="label text-marigold">Instagram</p>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-lg"
            >
              {site.socials.instagramHandle}
            </a>
          </div>
        </div>

        <p className="mt-14 text-sm text-paper/70">{site.contact.location}</p>

        <div className="mt-16 flex flex-col items-start gap-8 border-t border-paper/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" aria-label="Studio Envelope home">
            <Logo variant="light" />
          </Link>
          <nav className="flex flex-wrap gap-6" aria-label="Footer">
            <Link href="/projects" className="label text-paper hover:text-marigold">
              Projects
            </Link>
            <Link href="/about" className="label text-paper hover:text-marigold">
              Studio
            </Link>
            <Link href="/services" className="label text-paper hover:text-marigold">
              Services
            </Link>
            <Link href="/contact" className="label text-paper hover:text-marigold">
              Contact
            </Link>
          </nav>
          <p className="label text-paper/60">© {new Date().getFullYear()} Studio Envelope</p>
        </div>
      </div>
    </footer>
  );
}
