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
    <div className="band-dark relative flex min-h-[60svh] items-end overflow-hidden pt-28 sm:min-h-[70svh] sm:pt-40">
      {background && (
        <>
          <Image src={background.src} alt={background.alt} fill priority sizes="100vw" className="absolute inset-0 -z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/78 to-abyss/72" />
        </>
      )}
      <div className="container-x pb-14 sm:pb-24">
        <h1 className="h1 max-w-5xl text-bone">{title}</h1>
        {children && <div className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:mt-8 sm:text-lg">{children}</div>}
      </div>
    </div>
  );
}
