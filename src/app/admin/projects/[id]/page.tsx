"use client";

import { use, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Project } from "@/lib/types";
import { getProjectById } from "@/lib/admin-api";
import ProjectForm from "@/components/admin/ProjectForm";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getProjectById(id).then((p) => {
      if (!cancelled) setProject(p);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (project === undefined) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#EDE8E0]/50 py-10 justify-center">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </div>
    );
  }

  if (project === null) {
    return <p className="text-sm text-[#EDE8E0]/50 py-10 text-center">Project not found.</p>;
  }

  return <ProjectForm id={id} initial={project} />;
}
