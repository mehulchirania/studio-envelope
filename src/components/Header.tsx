"use client";
import Link from "next/link";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
const links = [{ href: "/projects", label: "Work", number: "01" }, { href: "/about", label: "Studio", number: "02" }, { href: "/contact", label: "Contact", number: "03" }];
export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);
  return <header className="new-header"><div className="new-header-inner"><Link href="/" aria-label="Studio Envelope home" className="new-wordmark" onClick={() => setMenuOpen(false)}><Logo size="sm" /></Link><nav className="new-nav" aria-label="Primary">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname.startsWith(link.href) ? "page" : undefined}><sup>{link.number}</sup>{link.label}</Link>)}</nav><Link className="start-link" href="/contact">Start a conversation <ArrowUpRight size={17} /></Link><button type="button" className="mobile-toggle" aria-controls="mobile-menu" aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>{menuOpen && <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}><span>{link.number} / {link.label}</span><ArrowUpRight /></Link>)}</nav>}</header>;
}

