import clsx from "clsx";

/**
 * The triangle and dot from the studio logo, without the gold bars or wordmark.
 * Proportions are measured from public/brand/logo-color.png: a triangle with
 * straight edges (slope ~0.65) and a softly rounded right tip, then a small
 * separate dot centred on the same horizontal axis.
 */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 260"
      aria-hidden="true"
      focusable="false"
      className={clsx("h-12 w-auto text-brand", className)}
      fill="currentColor"
      shapeRendering="geometricPrecision"
    >
      <path d="M0 0 L130 85 C150 98 166 114 166 130 C166 146 150 162 130 175 L0 260 Z" />
      <circle cx="204" cy="130" r="16" />
    </svg>
  );
}
