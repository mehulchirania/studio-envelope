import Link from "next/link";

/**
 * The full colour studio logo as layered SVG, linking to /about. No vector file was supplied, so the
 * bars, triangle and dot are redrawn from measurements of public/brand/logo-color.png (1200x406) and the
 * grey wordmark is that PNG cropped to transparent (public/brand/logo-wordmark.png). At rest it matches the
 * logo. On hover, tap or keyboard focus the gold bars (logo gold #fab51a, not the muted marigold token) ease apart (the envelope opening) and the triangle
 * nudges toward the dot. CSS transitions only; off for reduced motion.
 */
export default function InteractiveLogo({ className }: { className?: string }) {
  // Shared transition for every moving layer; the motion-safe variants below keep reduced motion still.
  const layer = "transition-transform duration-500 ease-out motion-reduce:transition-none";

  return (
    <Link
      href="/about"
      aria-label="Studio Envelope, about the studio"
      className={`group block outline-offset-[14px] focus-visible:outline-2 focus-visible:outline-brand ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 1200 406"
        aria-hidden="true"
        focusable="false"
        className="block h-auto w-full overflow-visible"
        shapeRendering="geometricPrecision"
      >
        <rect
          x="0"
          y="4"
          width="275"
          height="15"
          className={`fill-[#fab51a] ${layer} motion-safe:group-hover:-translate-y-[26px] motion-safe:group-focus-visible:-translate-y-[26px] motion-safe:group-active:-translate-y-[26px]`}
        />
        <rect
          x="0"
          y="340"
          width="275"
          height="16"
          className={`fill-[#fab51a] ${layer} motion-safe:group-hover:translate-y-[26px] motion-safe:group-focus-visible:translate-y-[26px] motion-safe:group-active:translate-y-[26px]`}
        />
        <path
          d="M0 42 L140 131 C156 143 166 160 166 180 C166 200 156 217 140 228 L0 317 Z"
          className={`fill-brand ${layer} motion-safe:group-hover:translate-x-[14px] motion-safe:group-focus-visible:translate-x-[14px] motion-safe:group-active:translate-x-[14px]`}
        />
        <circle cx="200.5" cy="179.5" r="17" className="fill-brand" />
        <image href="/brand/logo-wordmark.png" x="340" y="0" width="860" height="406" />
      </svg>
    </Link>
  );
}
