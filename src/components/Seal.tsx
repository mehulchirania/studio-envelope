import clsx from "clsx";

/**
 * The studio's "seal" device from the portfolio slides: a small marigold
 * square followed by a teal bar. Use sparingly as a section marker.
 */
export default function Seal({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-2", className)} aria-hidden="true">
      <span className="h-2.5 w-2.5 bg-marigold" />
      <span className="h-1 w-12 bg-teal" />
    </span>
  );
}
