"use client";

import { resetConsent } from "@/lib/consent";

/** Lets visitors change or withdraw their analytics-cookie choice at any time. */
export default function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        resetConsent();
        // Reload so any running analytics script stops.
        window.location.reload();
      }}
      className={className}
    >
      Cookie settings
    </button>
  );
}
