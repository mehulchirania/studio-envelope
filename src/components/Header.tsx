"use client";

import Link from "next/link";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { site } from "@/lib/site";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "Studio" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

/**
 * Fixed site header. Every page now opens on a dark hero, so the header is
 * transparent with light (bone) logo/links by default; past 80px of scroll
 * it becomes an abyss/85 panel with backdrop-blur. It hides on scroll down
 * and reappears on scroll up. Mobile gets a full-screen abyss overlay menu
 * with staggered large serif links, a focus trap, Esc-to-close and scroll
 * lock.
 */
export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const lastY = useRef(0);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => {
    setSolid(value > 80);
    if (menuOpen) {
      setHidden(false);
    } else {
      setHidden(value > lastY.current && value > 160);
    }
    lastY.current = value;
  });

  // Escape to close + body scroll lock + focus trap while the mobile menu is open.
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
      const focusable = overlayRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
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

  // Close the mobile menu on route change (e.g. browser back/forward). This
  // effect's job is precisely to synchronize open state with the route.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [pathname]);

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "bg-abyss/85 backdrop-blur-md" : "bg-transparent"
      }`}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container-x flex h-20 items-center justify-between gap-6 sm:h-24">
        <Link href="/" aria-label="Studio Envelope home" onClick={() => setMenuOpen(false)}>
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
                className={`label link-underline border-b-2 pb-1 text-bone transition-colors ${
                  active ? "border-marigold" : "border-transparent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/contact" className="label link-underline hidden shrink-0 text-bone md:block">
          Enquire
        </Link>

        <button
          type="button"
          className="text-bone md:hidden"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-50 flex flex-col justify-between bg-abyss px-6 py-10"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.77, 0, 0.18, 1] }}
          >
            <div className="flex items-center justify-between">
              <Logo variant="light" />
              <button type="button" aria-label="Close menu" className="text-bone" onClick={() => setMenuOpen(false)}>
                <X />
              </button>
            </div>
            <nav className="flex flex-col gap-2" aria-label="Mobile">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-5xl font-light text-bone hover:text-marigold sm:text-7xl"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex flex-col gap-3 border-t border-hairline-light pt-6">
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="label text-marigold">
                Enquire
              </Link>
              <a href={site.contact.phoneHref} className="label text-mist">
                {site.contact.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
