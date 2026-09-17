import type { SVGProps } from "react";

/**
 * lucide-react ships no brand/social icons, so social glyphs used across the
 * site are recreated here as simple line icons in the same stroke style
 * (round caps/joins, currentColor, 2px stroke) as the rest of the iconography.
 */

export function InstagramIcon({ size = 18, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
