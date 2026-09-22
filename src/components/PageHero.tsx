import type { ReactNode } from "react";
import Image from "next/image";
import RevealText from "./motion/RevealText";

type PageHeroProps = {
  label: string;
  title: string;
  children?: ReactNode;
  /** Optional background photo; rendered under a night gradient so the
   * title/label stay readable. */
  background?: { src: string; alt: string };
};

/** Dark page-opening hero used at the top of every top-level page (every
 * page now opens dark, per the v2 direction — the fixed header sits
 * transparently over this). min-h ~70svh; padding-top clears the fixed
 * header height itself. */
export default function PageHero({ label, title, children, background }: PageHeroProps) {
  return (
    <div className="band-dark relative flex min-h-[70svh] items-end overflow-hidden pt-32 sm:pt-40">
      {background && (
        <>
          <Image
            src={background.src}
            alt={background.alt}
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/70 to-night/30" />
        </>
      )}
      <div className="container-x pb-20 sm:pb-28">
        <p className="label mb-6 text-mist">{label}</p>
        <h1 className="h1 max-w-5xl text-bone">
          <RevealText as="span" text={title} />
        </h1>
        {children && <div className="mt-8 max-w-xl text-base leading-relaxed text-mist">{children}</div>}
      </div>
    </div>
  );
}
