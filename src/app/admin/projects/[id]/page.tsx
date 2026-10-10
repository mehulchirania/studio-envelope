"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { getProject } from "@/lib/admin/client";
import ProjectForm from "@/components/admin/ProjectForm";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getProject(id)
      .then((p) => {
        if (!cancelled) setProject(p);
      })
      .catch(() => {
        if (!cancelled) setProject(null);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (project === undefined) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted py-16">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-sm text-muted">That project couldn&rsquo;t be found.</p>
        <Link href="/admin" className="text-sm text-teal-deep hover:underline">
          Back to all projects
        </Link>
      </div>
    );
  }

  return <ProjectForm project={project} />;
}
