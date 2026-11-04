"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { setConsent, useConsent } from "@/lib/consent";

/** Asks once whether analytics cookies (Google Tag Manager) may be used. Nothing
 * from Tag Manager loads until the visitor accepts. Static bar: no animation. */
export default function ConsentBanner() {
  const consent = useConsent();
  const pathname = usePathname();
  if (consent !== null || pathname?.startsWith("/admin")) return null;

  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className="band-dark fixed inset-x-0 bottom-0 z-50 border-t border-hairline-light bg-coal text-bone"
    >
      <div className="container-x flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-mist">
          We use analytics cookies to understand how the site is used. They are only set if you accept.{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-bone">
            Privacy policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setConsent("denied")}
            className="min-h-11 border border-hairline-light px-6 text-sm uppercase tracking-[0.16em] text-bone transition-colors hover:border-bone"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => setConsent("granted")}
            className="min-h-11 bg-brand px-6 text-sm uppercase tracking-[0.16em] text-bone transition-colors hover:bg-brand-deep"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
