import ParallaxImage from "@/components/motion/ParallaxImage";
import RevealText from "@/components/motion/RevealText";
import Datasheet from "@/components/Datasheet";

type ProjectHeroProps = {
  title: string;
  subtitle?: string;
  scope: string;
  cover: { src: string; alt: string; width: number; height: number };
  datasheetItems: { label: string; value: string }[];
};

/** Full-bleed 100svh parallax cover opening a project detail page: title +
 * subtitle overlaid on a night gradient, with the datasheet pinned as a bar
 * at the very bottom of the hero. Supplies its own top padding since the
 * fixed header is transparent over it. */
export default function ProjectHero({ title, subtitle, scope, cover, datasheetItems }: ProjectHeroProps) {
  return (
    <div className="band-dark relative flex h-[100svh] min-h-[600px] flex-col overflow-hidden">
      <div className="absolute inset-0">
        <ParallaxImage
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          sizes="100vw"
          priority
          overlay
          strength={0.08}
          className="h-full w-full"
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-end pt-32 sm:pt-40">
        <div className="container-x pb-10 sm:pb-14">
          <p className="label mb-5 text-mist">{scope}</p>
          <h1 className="display-xl max-w-5xl text-bone">
            <RevealText text={title} />
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl font-display text-2xl italic text-mist sm:text-3xl">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="relative z-10 pb-6 sm:pb-8">
        <div className="container-x">
          <Datasheet items={datasheetItems} tone="dark" />
        </div>
      </div>
    </div>
  );
}
