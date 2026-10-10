"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { RoomImage } from "@/lib/content/types";

type LightboxProps = {
  images: RoomImage[];
  /** Index into `images`, or null when closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

/** The site's single lightbox: a dialog with focus management, Escape to
 * close, arrow-key and swipe navigation, and a caption with counter.
 * Controlled by the caller so any gallery can share it. */
export default function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const isOpen = index !== null;

  const prev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const next = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Tab") {
        // Keep focus on the close button: the other controls are pointer/arrow shortcuts.
        e.preventDefault();
        closeRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose, prev, next]);

  const current = index !== null ? images[index] : null;
  if (index === null || !current) return null;

  const multiple = images.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${current.alt} — image ${index + 1} of ${images.length}`}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-abyss/95 p-3 sm:p-10"
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null || !multiple) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute right-2 top-2 z-10 flex h-12 w-12 items-center justify-center text-paper transition-colors hover:text-marigold sm:right-8 sm:top-8"
      >
        <X size={26} />
      </button>

      {multiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous image"
          className="absolute left-1 z-10 hidden h-12 w-12 items-center justify-center text-paper transition-colors hover:text-marigold sm:left-6 sm:flex"
        >
          <ChevronLeft size={30} />
        </button>
      )}

      <div className="relative h-[72svh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <Image key={current.src} src={current.src} alt={current.alt} fill sizes="90vw" className="object-contain" priority />
      </div>

      {multiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next image"
          className="absolute right-1 z-10 hidden h-12 w-12 items-center justify-center text-paper transition-colors hover:text-marigold sm:right-6 sm:flex"
        >
          <ChevronRight size={30} />
        </button>
      )}

      <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-1 px-6 text-center text-paper sm:bottom-6">
        <p className="text-sm">{current.alt}</p>
        <span className="label text-paper/70">
          {index + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}
