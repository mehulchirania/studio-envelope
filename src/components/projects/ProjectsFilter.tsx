"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Project } from "@/lib/types";
import { categories } from "@/lib/categories";
import ProjectBlocks from "./ProjectBlocks";

const scopeBySlug: Record<string, Project["scope"]> = Object.fromEntries(
  categories.map((c) => [c.slug, c.name])
);

/** All / Interior / Architecture & Interior filter chips for /projects,
 * synced to the ?scope= URL param, plus the filtered project list itself. */
export default function ProjectsFilter({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("scope");
  const activeScope = activeSlug ? scopeBySlug[activeSlug] : undefined;

  const setScope = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) params.set("scope", slug);
      else params.delete("scope");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const filtered = activeScope ? projects.filter((p) => p.scope === activeScope) : projects;

  return (
    <div>
      <div role="group" aria-label="Filter projects by scope" className="mb-14 flex flex-wrap gap-3">
        <button type="button" aria-pressed={!activeScope} onClick={() => setScope(null)} className={chipClass(!activeScope)}>
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            aria-pressed={activeScope === c.name}
            onClick={() => setScope(c.slug)}
            className={chipClass(activeScope === c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <ProjectBlocks projects={filtered} />
    </div>
  );
}

function chipClass(active: boolean) {
  return `label border px-4 py-2 transition-colors ${
    active ? "border-teal bg-teal text-paper" : "border-hairline text-muted hover:border-teal hover:text-ink"
  }`;
}
