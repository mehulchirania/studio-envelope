"use client";

import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import ProjectImage from "@/components/ProjectImage";
import HoverPreview, { useHoverPreview } from "@/components/motion/HoverPreview";
import type { Project, RoomImage } from "@/lib/types";

type Row = { project: Project; cover: Pick<RoomImage, "src" | "alt" | "width" | "height"> };

/** Bone projects index: every project as a large serif title row with
 * location/scope/year columns. Desktop gets a HoverPreview image that
 * follows the cursor; mobile shows an inline thumbnail instead. */
export default function ProjectsIndex({ rows }: { rows: Row[] }) {
  const items = rows.map((row) => ({ id: row.project.slug, image: row.cover }));

  return (
    <section className="band-bone">
      <div className="container-x section-y">
        <SectionHeader label="Projects" heading="Selected work" action={{ href: "/projects", label: "All projects" }} />

        <HoverPreview items={items} className="mt-12 block">
          <ul className="flex flex-col">
            {rows.map((row, i) => (
              <ProjectRow key={row.project.id} row={row} index={i} />
            ))}
          </ul>
        </HoverPreview>
      </div>
    </section>
  );
}

function ProjectRow({ row, index }: { row: Row; index: number }) {
  const setActive = useHoverPreview();
  const { project, cover } = row;

  return (
    <li className="border-b border-hairline">
      <Link
        href={`/projects/${project.slug}`}
        onMouseEnter={() => setActive(project.slug)}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive(project.slug)}
        onBlur={() => setActive(null)}
        data-cursor="view"
        className="group flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-9"
      >
        <div className="flex items-center gap-5 sm:gap-8">
          <span className="label text-muted">{String(index + 1).padStart(2, "0")}</span>
          <ProjectImage image={cover} sizes="64px" className="h-16 w-16 shrink-0 sm:hidden" />
          <h3 className="link-underline font-display text-4xl font-light text-ink transition-colors duration-300 group-hover:text-teal sm:text-6xl">
            {project.title}
          </h3>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-2 pl-[3.25rem] sm:pl-0">
          <span className="label text-muted">{project.location}</span>
          <span className="label text-muted">{project.scope}</span>
          <span className="label text-muted">{project.status === "Ongoing" ? "Ongoing" : project.year}</span>
        </div>
      </Link>
    </li>
  );
}
