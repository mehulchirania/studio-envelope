import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

/** Full-width band closing a project page: the next project's cover with a
 * dark scrim, wrapping around to the first project after the last. */
export default function NextProjectBand({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block h-[56vh] min-h-[420px] w-full overflow-hidden bg-ink"
    >
      <Image
        src={project.coverImage}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-70 transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-ink/55" aria-hidden="true" />
      <div className="container-x relative flex h-full flex-col justify-end pb-16 text-paper">
        <p className="label mb-4 text-paper/70">Next project</p>
        <h2 className="h1 max-w-2xl">{project.title}</h2>
        <span className="link-arrow mt-6 border-paper/40 text-paper">
          View project
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}
