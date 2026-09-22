"use client";

import clsx from "clsx";
import RevealImage from "@/components/motion/RevealImage";
import ParallaxImage from "@/components/motion/ParallaxImage";
import type { RoomImage } from "@/lib/types";
import { useProjectLightbox } from "./ProjectLightboxProvider";

type RoomImageFrameProps = {
  image: RoomImage;
  /** Index of this image within the ProjectLightboxProvider's image list. */
  index: number;
  sizes: string;
  /** "parallax" for full-bleed single images, "reveal" (clip-path wipe) for
   * paired/mixed layouts. Defaults to "reveal". */
  variant?: "reveal" | "parallax";
  className?: string;
  priority?: boolean;
};

/** A room photo/render that opens the shared project lightbox on click,
 * animated with RevealImage or ParallaxImage. Renders (as opposed to photos)
 * keep the small "Visualisation" chip. Must be used inside a
 * ProjectLightboxProvider. */
export default function RoomImageFrame({ image, index, sizes, variant = "reveal", className, priority }: RoomImageFrameProps) {
  const { open } = useProjectLightbox();

  return (
    <button
      type="button"
      onClick={() => open(index)}
      aria-label={`Open image: ${image.alt}`}
      data-cursor="view"
      className={clsx("group relative block h-full w-full text-left", className)}
    >
      {variant === "parallax" ? (
        <ParallaxImage
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className="h-full w-full"
        />
      ) : (
        <RevealImage
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className="h-full w-full"
        />
      )}
      {image.kind === "render" && (
        <span className="label absolute bottom-3 left-3 z-10 bg-abyss/80 px-2.5 py-1 text-bone">Visualisation</span>
      )}
    </button>
  );
}
