import Image from "next/image";
import clsx from "clsx";
import type { RoomImage } from "@/lib/types";

type ProjectImageProps = {
  image: Pick<RoomImage, "src" | "alt" | "width" | "height"> & { kind?: RoomImage["kind"] };
  /** Required: next/image needs an explicit sizes hint since these run at
   * many different layout widths across the site. */
  sizes: string;
  className?: string;
  priority?: boolean;
};

/** Standard project photograph: square corners, no shadow. Renders (as
 * opposed to photos) get a small "Visualisation" chip bottom-left. */
export default function ProjectImage({ image, sizes, className, priority }: ProjectImageProps) {
  return (
    <div className={clsx("relative overflow-hidden bg-paper-2", className)}>
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
        <span className="label absolute bottom-3 left-3 bg-paper/80 px-2.5 py-1 text-ink">
          Visualisation
        </span>
      )}
    </div>
  );
}
