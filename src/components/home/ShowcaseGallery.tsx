import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import Datasheet from "@/components/Datasheet";
import ProjectImage from "@/components/ProjectImage";
import HorizontalGallery from "@/components/motion/HorizontalGallery";
import type { Project, RoomImage } from "@/lib/types";

type DatasheetItem = { label: string; value: string };

/** Night pinned showcase: an intro card (title, datasheet, view link)
 * followed by room photos with labels, scrolling horizontally as the
 * visitor scrolls down (see HorizontalGallery). */
export default function ShowcaseGallery({
  project,
  datasheet,
  rooms,
}: {
  project: Project;
  datasheet: DatasheetItem[];
  rooms: { image: RoomImage; room: string }[];
}) {
  const introCard = (
    <div className="flex aspect-[3/4] w-full flex-col justify-center bg-teal/25 p-8 sm:p-10">
      <p className="label text-mist">Featured project</p>
      <h3 className="h2 mt-4 text-bone">{project.title}</h3>
      <Datasheet items={datasheet} tone="dark" className="mt-8" />
      <Link href={`/projects/${project.slug}`} className="link-arrow mt-8 text-bone">
        View project <ArrowUpRight size={16} />
      </Link>
    </div>
  );

  const roomCards = rooms.map(({ image, room }) => (
    <div key={image.src} className="group relative aspect-[3/4] w-full overflow-hidden" data-cursor="drag">
      <ProjectImage image={image} sizes="(max-width: 1024px) 80vw, 38vw" tone="dark" className="h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/75 via-transparent to-transparent" />
      <p className="label absolute bottom-4 left-4 text-bone">{room}</p>
    </div>
  ));

  return (
    <section className="band-dark">
      <div className="container-x pb-10 pt-[clamp(56px,6vw,104px)]">
        <SectionHeader
          label="Showcase"
          heading="A walk through James Residence"
          tone="dark"
          action={{ href: "/projects", label: "All projects" }}
        />
      </div>
      <div className="pb-[clamp(56px,6vw,104px)]">
        <HorizontalGallery items={[introCard, ...roomCards]} />
      </div>
    </section>
  );
}
