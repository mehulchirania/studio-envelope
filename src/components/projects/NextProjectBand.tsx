import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";

/** Full-width band closing a project page: the next project's cover (wrapping
 * to the first after the last), its title, and a link. */
export default function NextProjectBand({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block min-h-[56svh] w-full overflow-hidden bg-abyss sm:min-h-[70svh]"
    >
      <Image src={project.coverImage} alt="" fill sizes="100vw" className="object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/50 to-abyss/10" aria-hidden="true" />
      <div className="container-x relative flex min-h-[56svh] flex-col justify-end pb-12 text-bone sm:min-h-[70svh] sm:pb-20">
        <p className="label mb-3 text-mist">Next project</p>
        <h2 className="display-xl max-w-3xl">{project.title}</h2>
        <span className="link-arrow mt-6 border-bone/30 text-bone sm:mt-8">
          View project
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}
