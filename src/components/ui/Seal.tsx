import clsx from "clsx";

/**
 * The studio's "seal" device from the portfolio slides: a small marigold
 * square followed by a bar. Use sparingly as a section marker. On bone
 * grounds both parts are brand blue; on dark grounds a marigold square and bone bar.
 */
export default function Seal({ className, tone = "light" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={clsx("inline-flex items-center gap-2", className)} aria-hidden="true">
      <span className={clsx("h-2.5 w-2.5", tone === "dark" ? "bg-marigold" : "bg-brand")} />
      <span className={clsx("h-1 w-12", tone === "dark" ? "bg-bone" : "bg-brand-deep")} />
    </span>
  );
}
