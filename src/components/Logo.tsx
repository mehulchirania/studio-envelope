import clsx from "clsx";

type LogoProps = {
  /** "teal" for use on paper backgrounds, "light" for use on the teal footer band. */
  variant?: "teal" | "light";
  /** Show the stacked "Studio / Envelope" wordmark next to the mark. Defaults to true. */
  showWordmark?: boolean;
  className?: string;
};

/**
 * Studio Envelope brand mark: a right-pointing envelope-flap triangle with a
 * rounded tip and a small dot, framed by two marigold bars — reads as an "E".
 * See public/images/projects/brand/cover-lockup.jpg for the source lockup.
 */
export default function Logo({ variant = "teal", showWordmark = true, className }: LogoProps) {
  const markColor = variant === "light" ? "#F6F3EE" : "#0E4B5E";
  const textColor = variant === "light" ? "#F6F3EE" : "#0E4B5E";

  return (
    <span className={clsx("inline-flex items-center gap-3", className)}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="8" y="10" width="54" height="6" fill="#FCB618" />
        <path d="M8,20 L48,44 Q62,50 48,56 L8,80 Z" fill={markColor} />
        <circle cx="76" cy="50" r="6.5" fill={markColor} />
        <rect x="8" y="84" width="54" height="6" fill="#FCB618" />
      </svg>
      {showWordmark && (
        <span
          className="flex flex-col text-[15px] font-medium leading-[1.15] tracking-tight"
          style={{ color: textColor }}
        >
          <span>Studio</span>
          <span>Envelope</span>
        </span>
      )}
      {!showWordmark && <span className="sr-only">Studio Envelope</span>}
    </span>
  );
}
