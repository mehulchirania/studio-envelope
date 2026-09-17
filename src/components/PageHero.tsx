import type { ReactNode } from "react";
import RevealOnScroll from "./RevealOnScroll";

export default function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-hairline px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <p className="eyebrow mb-6">{eyebrow}</p>
          <h1 className="max-w-4xl font-display text-5xl leading-[0.93] tracking-[-0.04em] text-fg sm:text-7xl lg:text-8xl">
            {title}
          </h1>
          {children && <div className="mt-8 max-w-xl text-base leading-relaxed text-muted">{children}</div>}
        </RevealOnScroll>
      </div>
    </div>
  );
}

