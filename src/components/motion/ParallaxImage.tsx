"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

type ParallaxImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  /** How far the image drifts as a fraction of its height, e.g. 0.12 = ±12%. */
  strength?: number;
  className?: string;
  /** Adds a night gradient over the image (bottom-heavy), for text overlays. */
  overlay?: boolean;
};

/** A next/image inside an overflow-hidden frame; the image is slightly
 * oversized and translates on the Y axis as the frame scrolls through the
 * viewport, then settles back to rest. Falls back to a static image when
 * prefers-reduced-motion is set. */
export default function ParallaxImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority,
  strength = 0.12,
  className,
  overlay = false,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength * 100}%`, `${strength * 100}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden bg-teal/20 ${className ?? ""}`}>
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y }}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className="h-full w-full scale-[1.2] object-cover"
        />
      </motion.div>
      {overlay && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-transparent" />
      )}
      {/* keeps intrinsic aspect for layout without JS */}
      <span className="sr-only">{alt}</span>
    </div>
  );
}
