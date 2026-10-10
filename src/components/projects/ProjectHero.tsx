import Image from "next/image";
import Datasheet from "@/components/ui/Datasheet";

type ProjectHeroProps = {
  title: string;
  subtitle?: string;
  cover: { src: string; alt: string; width: number; height: number };
  datasheetItems: { label: string; value: string }[];
};

/** Full-bleed opening of a project page: the cover photo under a brown
 * gradient, the title and subtitle, and the datasheet along the bottom.
 * Supplies its own top padding since the fixed header overlays it. */
export default function ProjectHero({ title, subtitle, cover, datasheetItems }: ProjectHeroProps) {
  return (
    <div className="band-dark relative flex min-h-[64svh] flex-col overflow-hidden sm:min-h-[72svh]">
      <Image src={cover.src} alt={cover.alt} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-abyss/50" aria-hidden="true" />

      <div className="relative z-10 flex flex-1 flex-col justify-end pt-28 sm:pt-40">
        <div className="container-x pb-8 sm:pb-12">
          <h1 className="display-xl max-w-5xl text-bone">{title}</h1>
          {subtitle && <p className="mt-4 max-w-2xl font-display text-xl italic text-mist sm:mt-5 sm:text-3xl">{subtitle}</p>}
        </div>
      </div>

      <div className="relative z-10 pb-5 sm:pb-8">
        <div className="container-x">
          <Datasheet items={datasheetItems} tone="dark" />
        </div>
      </div>
    </div>
  );
}
