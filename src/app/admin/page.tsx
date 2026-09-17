"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Download, Loader2, Plus, Star, Trash2 } from "lucide-react";
import type { Project } from "@/lib/types";
import {
  deleteProject,
  importSeedProjects,
  listAllProjects,
  reorderProjects,
  triggerRevalidate,
  updateProject,
} from "@/lib/admin-api";

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  async function load() {
    try {
      const list = await listAllProjects();
      setProjects(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects.");
    }
  }

  useEffect(() => {
    let cancelled = false;
    listAllProjects()
      .then((list) => {
        if (!cancelled) setProjects(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load projects.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function togglePublished(p: Project) {
    setBusyId(p.id);
    try {
      await updateProject(p.id, { published: !p.published });
      await triggerRevalidate();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project.");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleFeatured(p: Project) {
    setBusyId(p.id);
    try {
      await updateProject(p.id, { featured: !p.featured });
      await triggerRevalidate();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project.");
    } finally {
      setBusyId(null);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    if (!projects) return;
    const target = index + dir;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    setProjects(next);
    try {
      await reorderProjects(next.map((p) => p.id));
      await triggerRevalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder projects.");
      load();
    }
  }

  async function remove(p: Project) {
    if (!window.confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    setBusyId(p.id);
    try {
      await deleteProject(p.id);
      await triggerRevalidate();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleImportSeed() {
    setImporting(true);
    setError(null);
    try {
      await importSeedProjects();
      await triggerRevalidate();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import sample projects.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-light">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-full bg-[#5E9AA3] text-[#0B0C0C] font-medium hover:bg-[#5E9AA3]/90 transition-colors"
        >
          <Plus size={14} />
          New project
        </Link>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {!projects && !error && (
        <div className="flex items-center gap-2 text-sm text-[#EDE8E0]/50 py-10 justify-center">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}

      {projects && projects.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <p className="text-sm text-[#EDE8E0]/50">
            No projects yet. Create one, or import the site&apos;s sample projects to get started.
          </p>
          <button
            type="button"
            onClick={handleImportSeed}
            disabled={importing}
            className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border border-[#5E9AA3]/50 text-[#5E9AA3] hover:bg-[#5E9AA3]/10 transition-colors disabled:opacity-50"
          >
            {importing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Import sample projects
          </button>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="border border-[#EDE8E0]/10 rounded-xl overflow-hidden divide-y divide-[#EDE8E0]/10">
          {projects.map((p, index) => (
            <div key={p.id} className="flex items-center gap-4 px-4 py-3 hover:bg-[#EDE8E0]/[0.02] transition-colors">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="p-0.5 text-[#EDE8E0]/40 disabled:opacity-20 hover:text-[#EDE8E0]"
                  aria-label="Move up"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === projects.length - 1}
                  className="p-0.5 text-[#EDE8E0]/40 disabled:opacity-20 hover:text-[#EDE8E0]"
                  aria-label="Move down"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.coverImage || "https://placehold.co/80x60?text=%20"}
                alt=""
                className="w-16 h-12 object-cover rounded-md border border-[#EDE8E0]/10 shrink-0 bg-black/30"
              />

              <div className="min-w-0 flex-1">
                <Link href={`/admin/projects/${p.id}`} className="text-sm hover:text-[#5E9AA3] transition-colors">
                  {p.title || "Untitled"}
                </Link>
                <p className="text-xs text-[#EDE8E0]/40 truncate">
                  {p.category} · {p.location} · {p.year}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleFeatured(p)}
                disabled={busyId === p.id}
                title={p.featured ? "Unfeature" : "Feature"}
                className={`p-1.5 rounded-full transition-colors ${
                  p.featured ? "text-[#5E9AA3]" : "text-[#EDE8E0]/25 hover:text-[#EDE8E0]/60"
                }`}
              >
                <Star size={15} fill={p.featured ? "currentColor" : "none"} />
              </button>

              <button
                type="button"
                onClick={() => togglePublished(p)}
                disabled={busyId === p.id}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors shrink-0 ${
                  p.published
                    ? "border-[#5E9AA3]/50 text-[#5E9AA3] bg-[#5E9AA3]/10"
                    : "border-[#EDE8E0]/15 text-[#EDE8E0]/40"
                }`}
              >
                {p.published ? "Published" : "Draft"}
              </button>

              <button
                type="button"
                onClick={() => remove(p)}
                disabled={busyId === p.id}
                className="p-1.5 rounded-full text-[#EDE8E0]/30 hover:text-red-400 transition-colors"
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
