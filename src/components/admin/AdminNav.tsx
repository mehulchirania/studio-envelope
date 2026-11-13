"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Film, KeyRound, LayoutGrid, LogOut, Mail } from "lucide-react";
import { logout } from "@/lib/admin/client";

const links = [
  { href: "/admin", label: "Projects", icon: LayoutGrid },
  { href: "/admin/videos", label: "Videos", icon: Film },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/account", label: "Password", icon: KeyRound },
];

export default function AdminNav({ user, onSignedOut }: { user: string; onSignedOut: () => void }) {
  const pathname = usePathname();

  async function signOut() {
    await logout().catch(() => undefined);
    onSignedOut();
  }

  return (
    <header className="sticky top-0 z-10 border-b border-hairline bg-bone/95 backdrop-blur">
      {/* Top bar: brand on the left, account actions always pinned to the right. */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/admin" className="min-w-0 truncate text-[15px] font-medium tracking-tight text-ink">
          Studio Envelope <span className="font-normal text-muted">Admin</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-full text-muted hover:text-ink hover:bg-ink/10 transition-colors"
          >
            <ExternalLink size={14} aria-hidden="true" />
            <span className="hidden sm:inline">View website</span>
            <span className="sr-only sm:hidden">View website</span>
          </Link>
          <span className="hidden md:inline h-5 w-px bg-hairline" aria-hidden="true" />
          <span className="hidden md:inline text-sm text-muted">
            <span className="capitalize text-ink">{user}</span>
          </span>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-full bg-night text-bone font-medium hover:bg-abyss transition-colors"
          >
            <LogOut size={14} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>

      {/* Section tabs: underline style, scrolls sideways on narrow screens instead of wrapping. */}
      <nav aria-label="Admin sections" className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" || pathname.startsWith("/admin/projects") : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-2 px-3 sm:px-4 py-3 -mb-px text-sm border-b-2 transition-colors ${
                active ? "border-ink text-ink font-medium" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              <Icon size={15} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
