import type { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import Seal from "./Seal";

type SectionHeaderProps = {
  label?: string;
  heading: ReactNode;
  seal?: boolean;
  /** Optional link shown on the right, e.g. "View all projects". */
  action?: { href: string; label: string };
  className?: string;
  /** Works on both bone ("light") and dark grounds. */
  tone?: "dark" | "light";
};

/** Standard section heading: optional seal + label, an h2, and an optional
 * right-aligned link. Used to open a section of a page. */
export default function SectionHeader({ label, heading, seal = false, action, className, tone = "light" }: SectionHeaderProps) {
  return (
    <div className={clsx("flex flex-wrap items-end justify-between gap-6", className)}>
      <div>
        {seal && <Seal className="mb-5" tone={tone} />}
        {label && <p className={clsx("label mb-3", tone === "dark" && "text-mist")}>{label}</p>}
        <h2 className={clsx("h2", tone === "dark" ? "text-bone" : "text-ink")}>{heading}</h2>
      </div>
      {action && (
        <Link href={action.href} className={clsx("link-arrow link-underline shrink-0", tone === "dark" && "text-bone")}>
          {action.label} <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
