"use client";

import ProjectImage from "@/components/ProjectImage";
import type { RoomImage } from "@/lib/types";
import { useProjectLightbox } from "./ProjectLightboxProvider";

type LightboxImageProps = {
  image: Pick<RoomImage, "src" | "alt" | "width" | "height"> & { kind?: RoomImage["kind"] };
  /** Index of this image within the ProjectLightboxProvider's image list. */
  index: number;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/** A ProjectImage that opens the shared project lightbox, at this image's
 * index, when clicked. Must be rendered inside a ProjectLightboxProvider. */
export default function LightboxImage({ image, index, sizes, className, priority }: LightboxImageProps) {
  const { open } = useProjectLightbox();
  return (
    <button
      type="button"
      onClick={() => open(index)}
      aria-label={`Open image: ${image.alt}`}
      className={`block h-full w-full ${className ?? ""}`}
    >
      <ProjectImage image={image} sizes={sizes} priority={priority} className="h-full w-full" />
    </button>
  );
}
