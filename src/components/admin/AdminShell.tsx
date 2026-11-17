"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartColumn,
  ExternalLink,
  Film,
  Images,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { listMessages, logout } from "@/lib/admin/client";
import { useAdminTheme } from "@/components/admin/AdminThemeRoot";

const AdminUserContext = createContext("");
export const useAdminUser = () => useContext(AdminUserContext);

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Pathname prefixes that also mark this item active. */
  also?: string[];
}

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: "Site",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: ChartColumn },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/projects", label: "Projects", icon: LayoutGrid },
      { href: "/admin/carousel", label: "Home carousel", icon: Images },
      { href: "/admin/videos", label: "Videos", icon: Film },
    ],
  },
  {
    title: "Inbox",
    items: [{ href: "/admin/messages", label: "Enquiries", icon: Mail }],
  },
  {
    title: "Settings",
    items: [{ href: "/admin/account", label: "Password", icon: KeyRound }],
  },
];

const titles: [string, string][] = [
  ["/admin/analytics", "Analytics"],
  ["/admin/projects", "Projects"],
  ["/admin/carousel", "Home carousel"],
  ["/admin/videos", "Videos"],
  ["/admin/messages", "Enquiries"],
  ["/admin/account", "Password"],
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

function pageTitle(pathname: string) {
  return titles.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`))?.[1] ?? "Overview";
}

export default function AdminShell({ user, onSignedOut, children }: { user: string; onSignedOut: () => void; children: ReactNode }) {
  const pathname = usePathname();
  const { theme, toggle } = useAdminTheme();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);
  // The drawer is open only for the page it was opened on, so navigating closes it.
  const open = openFor === pathname;

  useEffect(() => {
    let cancelled = false;
    listMessages()
      .then((list) => {
        if (!cancelled) setUnread(list.filter((m) => !m.read).length);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenFor(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function signOut() {
    await logout().catch(() => undefined);
    onSignedOut();
  }

  const dark = theme === "dark";

  return (
    <AdminUserContext.Provider value={user}>
      <div className={`a-app${open ? " open" : ""}`}>
        <aside className="a-side" aria-label="Admin navigation">
          <div className="a-brand">
            {/* eslint-disable-next-line @next/next/no-img-element -- small static logo, no optimisation needed */}
            <img src="/brand/logo-white.png" alt="Studio Envelope" width={172} height={58} />
          </div>
          <div className="a-env">
            <span className="a-dot" aria-hidden="true" />
            <span>
              <b>studioenvelope.com</b> · Admin
            </span>
          </div>
          <nav className="a-nav">
            {groups.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                {group.items.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} aria-current={isActive(pathname, href) ? "page" : undefined}>
                    <Icon size={16} aria-hidden="true" />
                    {label}
                    {href === "/admin/messages" && unread > 0 && (
                      <span className="a-badge" aria-label={`${unread} unread`}>
                        {unread}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <div className="a-me">
            <span className="a-av" aria-hidden="true">
              {user.slice(0, 1)}
            </span>
            <div>
              <b>{user}</b>
              <span>Full admin</span>
            </div>
            <button type="button" onClick={signOut} aria-label="Sign out">
              <LogOut size={16} aria-hidden="true" />
            </button>
          </div>
        </aside>
        <div className="a-scrim" onClick={() => setOpenFor(null)} aria-hidden="true" />

        <div className="a-main">
          <header className="a-top">
            <button type="button" className="a-btn icon a-menu" onClick={() => setOpenFor(pathname)} aria-label="Open menu">
              <Menu size={16} aria-hidden="true" />
            </button>
            <div className="a-crumb">
              <span>Studio Envelope</span>
              <span aria-hidden="true">/</span>
              <b>{pageTitle(pathname)}</b>
            </div>
            <div className="a-top-end">
              <button
                type="button"
                className="a-btn icon"
                onClick={toggle}
                aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
                title={dark ? "Switch to light theme" : "Switch to dark theme"}
              >
                {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
              </button>
              <Link href="/" target="_blank" className="a-btn sm">
                <ExternalLink size={14} aria-hidden="true" />
                <span className="hidden sm:inline">View website</span>
                <span className="sr-only sm:hidden">View website</span>
              </Link>
            </div>
          </header>
          <main className="a-page">{children}</main>
        </div>
      </div>
    </AdminUserContext.Provider>
  );
}
