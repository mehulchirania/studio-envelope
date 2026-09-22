import clsx from "clsx";
import type { Room } from "@/lib/types";
import { layoutRoom, slugifyRoom } from "./roomLayout";
import RoomImageFrame from "./RoomImageFrame";

type RoomChapterProps = {
  room: Room;
  index: number;
  total: number;
  /** Rooms alternate bone/night bands down the page. */
  tone: "dark" | "light";
  indexBySrc: Map<string, number>;
};

/** One room as a full-width band "chapter": label + room name, then a mixed
 * layout of its images — a lone landscape goes full-bleed, portraits pair up,
 * a landscape+portrait pair splits 2/3 + 1/3. */
export default function RoomChapter({ room, index, total, tone, indexBySrc }: RoomChapterProps) {
  const chunks = layoutRoom(room.images);
  const isDark = tone === "dark";

  return (
    <section id={slugifyRoom(room.name)} className={clsx(isDark ? "band-dark" : "band-bone", "section-y scroll-mt-28")}>
      <div className="container-x">
        <p className="label mb-3 text-marigold">
          Room {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h2 className={clsx("font-display text-3xl italic sm:text-4xl", isDark ? "text-bone" : "text-ink")}>
          {room.name}
        </h2>
      </div>

      <div className="mt-10 space-y-2 sm:space-y-3">
        {chunks.map((chunk, ci) => {
          if (chunk.type === "single") {
            return (
              <div key={ci} className="w-full" style={{ aspectRatio: `${chunk.image.width} / ${chunk.image.height}` }}>
                <RoomImageFrame
                  image={chunk.image}
                  index={indexBySrc.get(chunk.image.src) ?? 0}
                  sizes="100vw"
                  variant="parallax"
                  priority={index === 0 && ci === 0}
                />
              </div>
            );
          }

          if (chunk.type === "pair") {
            return (
              <div key={ci} className="container-x grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                {chunk.images.map((image) => (
                  <div key={image.src} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
                    <RoomImageFrame image={image} index={indexBySrc.get(image.src) ?? 0} sizes="(min-width: 1024px) 45vw, 92vw" />
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div key={ci} className="container-x grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              <div className="sm:col-span-2" style={{ aspectRatio: `${chunk.wide.width} / ${chunk.wide.height}` }}>
                <RoomImageFrame image={chunk.wide} index={indexBySrc.get(chunk.wide.src) ?? 0} sizes="(min-width: 1024px) 60vw, 92vw" />
              </div>
              <div style={{ aspectRatio: `${chunk.narrow.width} / ${chunk.narrow.height}` }}>
                <RoomImageFrame image={chunk.narrow} index={indexBySrc.get(chunk.narrow.src) ?? 0} sizes="(min-width: 1024px) 30vw, 92vw" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
