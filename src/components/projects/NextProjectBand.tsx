import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import Seal from "@/components/Seal";

/** Full-bleed band closing a project page: the next project's cover, which
 * scales in slowly on hover, wrapping around to the first project after the
 * last. */
export default function NextProjectBand({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor="view"
      className="group relative block h-[90vh] min-h-[520px] w-full overflow-hidden bg-abyss"
    >
      <Image
        src={project.coverImage}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-70 transition-transform duration-[1400ms] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/50 to-abyss/10" aria-hidden="true" />
      <div className="container-x relative flex h-full flex-col justify-end pb-16 text-bone sm:pb-20">
        <Seal tone="dark" className="mb-6" />
        <p className="label mb-4 text-mist">Next project</p>
        <h2 className="display-xl max-w-3xl">{project.title}</h2>
        <span className="link-arrow mt-8 border-bone/30 text-bone">
          View project
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}
