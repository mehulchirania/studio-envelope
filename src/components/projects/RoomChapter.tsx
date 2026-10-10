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

/** One room as a band: its name, then its images laid out by orientation in a
 * centred column (max ~1000px, so photos stay easy to take in on big screens
 * instead of running edge to edge). A lone landscape fills the column,
 * portraits pair up, a landscape beside a portrait splits 2/3 + 1/3, and a
 * lone portrait stays narrow instead of filling a whole phone screen. */
export default function RoomChapter({ room, tone, indexBySrc }: RoomChapterProps) {
  const chunks = layoutRoom(room.images);
  const isDark = tone === "dark";

  return (
    <section id={slugifyRoom(room.name)} className={clsx(isDark ? "band-dark" : "band-bone", "scroll-mt-20 py-10 sm:py-14")}>
      <div className="container-x">
        <div className="mx-auto max-w-5xl">
          <h2 className={clsx("font-display text-3xl italic sm:text-4xl", isDark ? "text-bone" : "text-ink")}>{room.name}</h2>

          <div className="mt-6 space-y-2 sm:mt-8 sm:space-y-3">
            {chunks.map((chunk, i) => {
              if (chunk.type === "single") {
                const portrait = chunk.image.height > chunk.image.width;
                return portrait ? (
                  <div key={i} className="mx-auto max-w-xs sm:max-w-sm">
                    <Frame image={chunk.image} indexBySrc={indexBySrc} sizes="(min-width: 640px) 24rem, 80vw" />
                  </div>
                ) : (
                  <Frame key={i} image={chunk.image} indexBySrc={indexBySrc} sizes="(min-width: 1024px) 64rem, 92vw" />
                );
              }

              if (chunk.type === "pair") {
                return (
                  <div key={i} className="grid grid-cols-2 gap-2 sm:gap-3">
                    {chunk.images.map((image) => (
                      <Frame key={image.src} image={image} indexBySrc={indexBySrc} sizes="(min-width: 1024px) 32rem, 46vw" />
                    ))}
                  </div>
                );
              }

              return (
                <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                  <div className="sm:col-span-2">
                    <Frame image={chunk.wide} indexBySrc={indexBySrc} sizes="(min-width: 1024px) 42rem, 92vw" />
                  </div>
                  <Frame image={chunk.narrow} indexBySrc={indexBySrc} sizes="(min-width: 1024px) 21rem, 92vw" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
