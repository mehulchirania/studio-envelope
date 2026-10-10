"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { site } from "@/lib/content/site";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "Studio" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

/** Fixed site header, overlaying each page's dark hero. Desktop shows the
 * links inline; mobile opens a full-screen menu with a focus trap, Esc to
 * close and body scroll lock. */
export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = overlayRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Close the menu whenever the route changes (including back/forward).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 border-b border-bone/10 bg-abyss/90 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-6 sm:h-20">
        <Link href="/" aria-label="Studio Envelope home" className="shrink-0">
          <Logo variant="light" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`label link-underline border-b-2 py-2 text-bone ${active ? "border-marigold" : "border-transparent"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/contact" className="label link-underline hidden shrink-0 py-2 text-bone md:block">
          Enquire
        </Link>

        <button
          type="button"
          className="-mr-2 grid h-11 w-11 place-items-center text-bone md:hidden"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>

    {/* Rendered outside <header>: the header's backdrop-filter would otherwise become the
        containing block for this fixed overlay and squash it to header height. */}
    {menuOpen && (
      <div
        id="mobile-menu"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-abyss px-6 py-4 text-bone"
      >
        <div className="flex h-12 shrink-0 items-center justify-between">
          <Logo variant="light" />
          <button
            type="button"
            aria-label="Close menu"
            className="-mr-2 grid h-11 w-11 place-items-center text-bone"
            onClick={() => setMenuOpen(false)}
          >
            <X />
          </button>
        </div>
        <nav className="mt-6 flex flex-col" aria-label="Mobile">
          {links.map((link, i) => (
            <Link
              key={link.href}
              ref={i === 0 ? firstLinkRef : undefined}
              href={link.href}
              aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? "page" : undefined}
              className="border-b border-hairline-light py-4 font-display text-4xl font-light text-bone hover:text-marigold aria-[current=page]:text-marigold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col pt-8">
          <Link href="/contact" className="label py-3 text-marigold">
            Enquire
          </Link>
          <a href={site.contact.phoneHref} className="label py-3 text-mist">
            {site.contact.phone}
          </a>
        </div>
      </div>
    )}
    </>
  );
}
