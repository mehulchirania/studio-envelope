import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import RevealText from "./motion/RevealText";
import MagneticButton from "./motion/MagneticButton";
import Marquee from "./motion/Marquee";
import { site } from "@/lib/site";

/** Abyss footer band: a giant "Write to us." reveal, a magnetic round
 * Enquire CTA, the contact grid, site nav, a marquee ribbon of the studio
 * email, and the copyright line. */
export default function Footer() {
  return (
    <footer className="band-darkest">
      <div className="container-x section-y">
        <div className="flex flex-col items-start gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label text-marigold">Have a space in mind?</p>
            <h2 className="display-xl mt-4 max-w-3xl text-bone">
              <RevealText as="span" text="Write to us." />
            </h2>
          </div>
          <MagneticButton href="/contact" className="label h-32 w-32 shrink-0 gap-1 px-2 text-center">
            Enquire
            <ArrowUpRight size={18} />
          </MagneticButton>
        </div>

        <div className="mt-16 grid gap-10 border-t border-hairline-light pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="label text-marigold">Email</p>
            <a href={`mailto:${site.contact.email}`} className="link-underline mt-2 block text-lg text-bone">
              {site.contact.email}
            </a>
          </div>
          <div>
            <p className="label text-marigold">Phone</p>
            <a href={site.contact.phoneHref} className="link-underline mt-2 block text-lg text-bone">
              {site.contact.phone}
            </a>
          </div>
          <div>
            <p className="label text-marigold">WhatsApp</p>
            <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="link-underline mt-2 block text-lg text-bone">
              Message us
            </a>
          </div>
          <div>
            <p className="label text-marigold">Instagram</p>
            <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="link-underline mt-2 block text-lg text-bone">
              {site.socials.instagramHandle}
            </a>
          </div>
        </div>

        <p className="mt-14 text-sm text-mist">{site.contact.location}</p>
      </div>

      <div className="border-t border-hairline-light py-6">
        <Marquee speed={18} className="text-mist">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="display-xl whitespace-nowrap text-[clamp(20px,3vw,32px)] font-light">
              {site.contact.email}
              <span className="mx-6 text-marigold">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-x flex flex-col items-start gap-8 border-t border-hairline-light py-8 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" aria-label="Studio Envelope home">
          <Logo variant="light" />
        </Link>
        <nav className="flex flex-wrap gap-6" aria-label="Footer">
          <Link href="/projects" className="label link-underline text-bone">
            Projects
          </Link>
          <Link href="/about" className="label link-underline text-bone">
            Studio
          </Link>
          <Link href="/services" className="label link-underline text-bone">
            Services
          </Link>
          <Link href="/contact" className="label link-underline text-bone">
            Contact
          </Link>
        </nav>
        <p className="label text-mist">© {new Date().getFullYear()} Studio Envelope</p>
      </div>
    </footer>
  );
}
