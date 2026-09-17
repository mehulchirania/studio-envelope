import Link from "next/link";
import Logo from "./Logo";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
export default function Footer() {
  return <footer className="new-footer page-gutter"><div className="footer-invitation"><div><p className="micro-label">Have a space in mind?</p><Link href="/contact" className="footer-title">LET’S MAKE<br />ROOM.<ArrowUpRight aria-hidden="true" /></Link></div><div className="footer-contact"><p>Good things begin<br />with a conversation.</p><a href={site.socials.instagram} target="_blank" rel="noopener noreferrer">@studio__envelope ↗</a><a href={site.contact.phoneHref}>{site.contact.phone}</a></div></div><div className="footer-bottom"><Link href="/" className="footer-brand"><Logo size="sm" /></Link><span>© {new Date().getFullYear()} Studio Envelope</span><div><Link href="/about">Studio</Link><Link href="/services">Services</Link><Link href="/projects">Work</Link><a href={site.socials.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></div></div></footer>;
}


