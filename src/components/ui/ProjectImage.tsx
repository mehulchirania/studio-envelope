import Image from "next/image";
import clsx from "clsx";
import type { RoomImage } from "@/lib/content/types";

type ProjectImageProps = {
  image: Pick<RoomImage, "src" | "alt" | "width" | "height"> & { kind?: RoomImage["kind"] };
  /** Required: next/image needs an explicit sizes hint since these run at
   * many different layout widths across the site. */
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Which band this sits on, so the "Visualisation" chip stays legible on
   * both bone and dark grounds. Defaults to "light" (bone). */
  tone?: "dark" | "light";
  /** data-cursor hint consumed by CursorFollower, e.g. "view". */
  cursor?: "view" | "drag";
};

/** Standard project photograph: square corners, no shadow. Renders (as
 * opposed to photos) get a small "Visualisation" chip bottom-left. */
export default function ProjectImage({ image, sizes, className, priority, tone = "light", cursor }: ProjectImageProps) {
  return (
    <div
      className={clsx("relative overflow-hidden", tone === "dark" ? "bg-teal/30" : "bg-paper-2", className)}
      data-cursor={cursor}
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover"
      />
      {image.kind === "render" && (
        <span
          className={clsx(
            "label absolute bottom-3 left-3 px-2.5 py-1",
            tone === "dark" ? "bg-abyss/80 text-bone" : "bg-bone/80 text-ink"
          )}
        >
          Visualisation
        </span>
      )}
    </div>
  );
}
