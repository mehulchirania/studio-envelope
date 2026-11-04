import type { RoomImage } from "@/lib/content/types";
import LightboxImage from "./LightboxImage";

/** Every photograph of a project in one uniform grid: equal 4:3 cells, no room
 * titles. Images are cropped to fit; the lightbox shows them in full. */
export default function ProjectGallery({ images, indexBySrc }: { images: RoomImage[]; indexBySrc: Map<string, number> }) {
  return (
    <section className="band-bone py-10 sm:py-14">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {images.map((image) => (
            <div key={image.src} className="aspect-[4/3]">
              <LightboxImage
                image={image}
                index={indexBySrc.get(image.src) ?? 0}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
