"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, LogOut, Mail } from "lucide-react";
import { signOutAdmin } from "@/lib/admin-api";

const links = [
  { href: "/admin", label: "Projects", icon: LayoutGrid },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default function AdminNav({ email }: { email?: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-[#EDE8E0]/10 sticky top-0 z-10 bg-[#0B0C0C]/95 backdrop-blur">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/admin" className="text-sm tracking-[0.15em] uppercase text-[#EDE8E0]/90">
          Studio Envelope <span className="text-[#5E9AA3]">Admin</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                  active ? "bg-[#5E9AA3]/15 text-[#5E9AA3]" : "text-[#EDE8E0]/60 hover:text-[#EDE8E0]"
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {email && <span className="hidden sm:inline text-xs text-[#EDE8E0]/40">{email}</span>}
          <button
            onClick={() => signOutAdmin()}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#EDE8E0]/15 hover:bg-[#EDE8E0]/5 transition-colors"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
