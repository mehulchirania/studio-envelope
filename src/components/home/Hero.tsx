import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import type { RoomImage } from "@/lib/content/types";

/** Opening of the home page: the studio line on a solid panel beside a single
 * photograph, so the headline never sits on top of the picture. Side by side
 * on desktop; on a phone the photo comes first, then the line. Still and calm:
 * no slideshow, no motion. */
export default function Hero({ image }: { image: RoomImage }) {
  return (
    <section className="band-dark lg:grid lg:min-h-[92svh] lg:grid-cols-[5fr_6fr]">
      {/* The fixed header overlays the top edge, so on a phone the photo starts below it. */}
      <div className="relative mt-16 h-[46svh] min-h-[280px] lg:order-2 lg:mt-0 lg:h-auto">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          priority
          className="object-cover object-[50%_60%]"
        />
      </div>

      <div className="container-x flex flex-col justify-between gap-14 py-10 sm:py-14 lg:order-1 lg:gap-0 lg:pb-16 lg:pt-40">
        <p className="label">Art · Interiors · Architecture</p>

        <div className="flex flex-col items-start gap-8">
          <h1 className="display-xl max-w-[10ch] text-bone">
            Spaces, sealed with care.
            <span className="sr-only"> — Architecture &amp; Interior Design Studio, Bangalore</span>
          </h1>
          <Link href="#studio" className="label flex min-h-11 items-center gap-2 text-bone">
            Discover the studio <ArrowDownRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
