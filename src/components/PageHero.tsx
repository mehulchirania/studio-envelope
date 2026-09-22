import type { ReactNode } from "react";
import RevealOnScroll from "./RevealOnScroll";

/** Page-opening header: a label, a Cormorant h1 and an optional intro
 * paragraph, on paper. Used at the top of every top-level page. */
export default function PageHero({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-hairline bg-paper">
      <div className="container-x py-20 sm:py-28">
        <RevealOnScroll>
          <p className="label mb-6">{label}</p>
          <h1 className="h1 max-w-4xl text-ink">{title}</h1>
          {children && <div className="mt-8 max-w-xl text-base leading-relaxed text-muted">{children}</div>}
        </RevealOnScroll>
      </div>
    </div>
  );
}
