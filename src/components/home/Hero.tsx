import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import type { RoomImage } from "@/lib/content/types";

/** Still opening image with the studio line. The first thing a visitor sees,
 * so it stays calm: no slideshow, no motion. */
export default function Hero({ image }: { image: RoomImage }) {
  return (
    <section className="relative h-[86svh] min-h-[520px] overflow-hidden bg-night sm:h-[92svh] sm:min-h-[600px]">
      <Image src={image.src} alt={image.alt} fill sizes="100vw" priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-abyss/72 via-abyss/10 to-abyss/82" />

      <div className="container-x relative z-10 flex h-full flex-col justify-between pb-8 pt-24 sm:pb-14 sm:pt-32">
        <p className="label text-bone">Art · Interiors · Architecture</p>

        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <h1 className="display-xl max-w-[12ch] text-bone">
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
