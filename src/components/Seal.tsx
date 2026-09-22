import clsx from "clsx";

/**
 * The studio's "seal" device from the portfolio slides: a small marigold
 * square followed by a bar. Use sparingly as a section marker. The bar is
 * teal on bone grounds, bone on dark grounds, for contrast.
 */
export default function Seal({ className, tone = "light" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={clsx("inline-flex items-center gap-2", className)} aria-hidden="true">
      <span className="h-2.5 w-2.5 bg-marigold" />
      <span className={clsx("h-1 w-12", tone === "dark" ? "bg-bone" : "bg-teal")} />
    </span>
  );
}
