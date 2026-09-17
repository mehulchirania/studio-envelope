import clsx from "clsx";

type LogoProps = {
  /** Show the wordmark next to the mark. */
  wordmark?: boolean;
  /** Visual size of the lockup. */
  size?: "sm" | "md" | "lg";
  className?: string;
  inverse?: boolean;
};

const sizes = {
  sm: { badge: "h-7 w-7 rounded-[5px]", icon: 14, text: "text-sm" },
  md: { badge: "h-9 w-9 rounded-[6px]", icon: 18, text: "text-lg" },
  lg: { badge: "h-14 w-14 rounded-[9px]", icon: 28, text: "text-3xl" },
} as const;

/**
 * Studio Envelope's mark: a right-pointing triangle set inside a bracket,
 * echoing an envelope flap. Recreated as an inline SVG — not a copy of any
 * source image.
 */
function Mark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16 11H11.5C10.6716 11 10 11.6716 10 12.5V31.5C10 32.3284 10.6716 33 11.5 33H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 11H32.5C33.3284 11 34 11.6716 34 12.5V31.5C34 32.3284 33.3284 33 32.5 33H28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18.5 16.5L27 22L18.5 27.5V16.5Z" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ wordmark = true, size = "md", className, inverse = false }: LogoProps) {
  const s = sizes[size];
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <span
        className={clsx(
          "flex shrink-0 items-center justify-center bg-teal",
          inverse ? "text-[#f3eee5]" : "text-fg",
          s.badge
        )}
      >
        <Mark size={s.icon} />
      </span>
      {wordmark && (
        <span className={clsx("font-display tracking-wide", inverse ? "text-[#f3eee5]" : "text-fg", s.text)}>
          Studio Envelope
        </span>
      )}
    </span>
  );
}

export { Mark as LogoMark };
