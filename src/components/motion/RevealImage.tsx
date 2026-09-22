"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, type ComponentProps } from "react";

type RevealImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  imageClassName?: string;
} & Pick<ComponentProps<typeof Image>, "quality">;

/** Image inside a frame that wipes open via clip-path (inset 100% -> 0) while
 * the inner image settles from a 1.25x scale to 1x, once it scrolls into
 * view. Driven by the standalone `useInView` hook (own IntersectionObserver)
 * rather than the `whileInView` prop, which this framer-motion build doesn't
 * reliably wire up. SSR renders plain, untransformed markup — the clip/scale
 * only apply once React has hydrated and mounted, so there's no invisible
 * flash without JS. */
export default function RevealImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority,
  className,
  fill = false,
  imageClassName,
  quality,
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px 0px 0px" });

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden bg-teal/20 ${className ?? ""}`}
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={inView ? { clipPath: "inset(0% 0 0 0)" } : undefined}
      transition={{ duration: 1.1, ease: [0.77, 0, 0.18, 1] }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.25 }}
        animate={inView ? { scale: 1 } : undefined}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {fill ? (
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} quality={quality} className={`object-cover ${imageClassName ?? ""}`} />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            priority={priority}
            quality={quality}
            className={`h-full w-full object-cover ${imageClassName ?? ""}`}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
