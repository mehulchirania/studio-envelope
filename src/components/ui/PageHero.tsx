import type { ReactNode } from "react";
import Image from "next/image";

type PageHeroProps = {
  title: string;
  children?: ReactNode;
  /** Optional background photo, shown under a brown gradient so the title stays readable. */
  background?: { src: string; alt: string };
};

/** Dark opening band for top-level pages. The fixed header overlays it, so
 * the top padding clears the header height. */
export default function PageHero({ title, children, background }: PageHeroProps) {
  return (
    // `isolate` makes this its own stacking context: without it the image and gradient below
    // (negative z-index) paint behind this band's own background and the hero looks like a plain brown box.
    <div className="band-dark relative isolate flex min-h-[60svh] items-end overflow-hidden pt-28 sm:min-h-[70svh] sm:pt-40">
      {background && (
        <>
          <Image src={background.src} alt={background.alt} fill priority sizes="100vw" className="absolute inset-0 -z-20 object-cover" />
          {/* Heaviest at the bottom, where the title sits, so the photo shows above it without hurting legibility. */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/95 via-night/60 to-abyss/25" />
          {/* Extra shade on the text side only, so the right of the photo stays bright. */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night/60 via-night/20 to-transparent" />
        </>
      )}
      <div className="container-x w-full pb-14 sm:pb-24">
        <h1 className="h1 max-w-5xl text-bone">{title}</h1>
        {children && <div className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:mt-8 sm:text-lg">{children}</div>}
      </div>
    </div>
  );
}
