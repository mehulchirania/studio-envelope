"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { RoomImage } from "@/lib/content/types";
import Lightbox from "@/components/ui/Lightbox";

type LightboxContextValue = {
  open: (index: number) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

/** Lets any LightboxImage further down the tree open the shared lightbox at
 * a given index, without prop-drilling through every room/drawing block. */
export function useProjectLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) {
    throw new Error("useProjectLightbox must be used within a ProjectLightboxProvider");
  }
  return ctx;
}

/** Wraps a project detail page: provides the click-to-open behaviour and
 * renders the single Lightbox instance shared by every image on the page
 * (room photos, renders and drawings alike). */
export default function ProjectLightboxProvider({
  images,
  children,
}: {
  images: RoomImage[];
  children: ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);

  const value = useMemo<LightboxContextValue>(() => ({ open: setIndex }), []);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <Lightbox images={images} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />
    </LightboxContext.Provider>
  );
}
