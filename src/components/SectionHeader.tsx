import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Seal from "./Seal";

type SectionHeaderProps = {
  label?: string;
  heading: ReactNode;
  seal?: boolean;
  /** Optional link shown on the right, e.g. "View all projects". */
  action?: { href: string; label: string };
  className?: string;
};

/** Standard section heading: optional seal + label, an h2, and an optional
 * right-aligned link. Used to open a section of a page. */
export default function SectionHeader({ label, heading, seal = false, action, className }: SectionHeaderProps) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-6 ${className ?? ""}`}>
      <div>
        {seal && <Seal className="mb-5" />}
        {label && <p className="label mb-3">{label}</p>}
        <h2 className="h2 text-ink">{heading}</h2>
      </div>
      {action && (
        <Link href={action.href} className="link-arrow shrink-0">
          {action.label} <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
