import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import RevealOnScroll from "./RevealOnScroll";
import { InstagramIcon } from "./icons";

export default function InstagramCTA({ images }: { images: string[] }) {
  return (
    <section className="border-t border-hairline bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <RevealOnScroll>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow mb-4">Follow along</p>
              <h2 className="font-display text-4xl text-fg sm:text-5xl">
                @studio__envelope
              </h2>
            </div>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border border-fg px-6 py-3 text-sm uppercase tracking-[0.18em] text-fg transition-colors hover:bg-fg hover:text-ink"
            >
              <InstagramIcon size={16} />
              Follow on Instagram
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
          {images.map((src, i) => (
            <a
              key={src + i}
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-ink"
              aria-label="Open Studio Envelope on Instagram"
            >
              <Image
                src={src}
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 768px) 16vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/40 group-hover:opacity-100">
                <InstagramIcon size={20} className="text-fg" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
