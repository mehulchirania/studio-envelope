import clsx from "clsx";
import type { Room, RoomImage } from "@/lib/content/types";
import LightboxImage from "./LightboxImage";
import { layoutRoom, slugifyRoom } from "./roomLayout";

type RoomChapterProps = {
  room: Room;
  /** Rooms alternate bone/night bands down the page. */
  tone: "dark" | "light";
  indexBySrc: Map<string, number>;
};

function Frame({ image, indexBySrc, sizes }: { image: RoomImage; indexBySrc: Map<string, number>; sizes: string }) {
  return (
    <div style={{ aspectRatio: `${image.width} / ${image.height}` }}>
      <LightboxImage image={image} index={indexBySrc.get(image.src) ?? 0} sizes={sizes} />
    </div>
  );
}

/** One room as a full-width band: its name, then its images laid out by
 * orientation. A lone landscape runs full-bleed, portraits pair up, a
 * landscape beside a portrait splits 2/3 + 1/3, and a lone portrait stays
 * at a comfortable width instead of filling a whole phone screen. */
export default function RoomChapter({ room, tone, indexBySrc }: RoomChapterProps) {
  const chunks = layoutRoom(room.images);
  const isDark = tone === "dark";

  return (
    <section id={slugifyRoom(room.name)} className={clsx(isDark ? "band-dark" : "band-bone", "section-y scroll-mt-20")}>
      <div className="container-x">
        <h2 className={clsx("font-display text-3xl italic sm:text-4xl", isDark ? "text-bone" : "text-ink")}>{room.name}</h2>
      </div>

      <div className="mt-8 space-y-2 sm:mt-10 sm:space-y-3">
        {chunks.map((chunk, i) => {
          if (chunk.type === "single") {
            const portrait = chunk.image.height > chunk.image.width;
            return portrait ? (
              <div key={i} className="container-x">
                <div className="mx-auto max-w-md">
                  <Frame image={chunk.image} indexBySrc={indexBySrc} sizes="(min-width: 768px) 28rem, 92vw" />
                </div>
              </div>
            ) : (
              <Frame key={i} image={chunk.image} indexBySrc={indexBySrc} sizes="100vw" />
            );
          }

          if (chunk.type === "pair") {
            return (
              <div key={i} className="container-x grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                {chunk.images.map((image) => (
                  <Frame key={image.src} image={image} indexBySrc={indexBySrc} sizes="(min-width: 1024px) 45vw, 92vw" />
                ))}
              </div>
            );
          }

          return (
            <div key={i} className="container-x grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              <div className="sm:col-span-2">
                <Frame image={chunk.wide} indexBySrc={indexBySrc} sizes="(min-width: 1024px) 60vw, 92vw" />
              </div>
              <Frame image={chunk.narrow} indexBySrc={indexBySrc} sizes="(min-width: 1024px) 30vw, 92vw" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
