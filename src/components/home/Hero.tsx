import Image from "next/image";
import InteractiveLogo from "@/components/home/InteractiveLogo";
import type { RoomImage } from "@/lib/content/types";

/** Opening of the home page: the studio line on a beige panel beside a single
 * photograph, so the headline never sits on top of the picture. Side by side
 * on desktop; on a phone the photo comes first, then the line. Still and calm:
 * no slideshow, no motion. */
export default function Hero({ image }: { image: RoomImage }) {
  return (
    // The fixed header overlays the top edge, so the section is padded by its height (64px on a phone,
    // 80px on desktop). Padding, not a margin on the photo: a top margin would collapse out of the section.
    <section className="band-bone pt-16 lg:grid lg:min-h-[92svh] lg:grid-cols-[5fr_6fr] lg:pt-20">
      <div className="relative aspect-[4/3] w-full lg:order-2 lg:aspect-auto">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          priority
          className="object-cover object-[50%_60%]"
        />
      </div>

      <div className="container-x flex flex-col items-center justify-center gap-7 py-16 text-center sm:py-20 lg:order-1 lg:gap-9 lg:py-16">
        <InteractiveLogo className="mb-3 w-[200px] sm:w-[260px] lg:mb-4 lg:w-[280px] xl:w-[300px]" />
        <p className="flex items-center justify-center gap-x-3 whitespace-nowrap font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-ink min-[400px]:gap-x-4 min-[400px]:text-xs min-[400px]:tracking-[0.28em] sm:text-sm sm:tracking-[0.32em] lg:text-[13px] lg:tracking-[0.26em] xl:text-sm xl:tracking-[0.3em] 2xl:text-base">
          <span>Interiors</span>
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
          <span>Architecture</span>
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
          <span>Art</span>
        </p>
        <span aria-hidden="true" className="h-px w-16 bg-ink/40" />
        <h1 className="max-w-[16ch] font-display text-[clamp(32px,3.6vw,56px)] font-light leading-[1.05] text-ink">
          Spaces, sealed with care.
          <span className="sr-only"> — Architecture &amp; Interior Design Studio, Bangalore</span>
        </h1>
      </div>
    </section>
  );
}
