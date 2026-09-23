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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-light">Projects</h1>
          {projects && projects.length > 0 && (
            <p className="text-sm text-[#EDE8E0]/45 mt-1">
              {projects.length} project{projects.length === 1 ? "" : "s"} · use the arrows to reorder, the star to
              feature
            </p>
          )}
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-1.5 text-sm px-5 py-2.5 rounded-full bg-[#5E9AA3] text-[#0B0C0C] font-medium hover:bg-[#5E9AA3]/90 transition-colors shrink-0"
        >
          <Plus size={16} />
          New project
        </Link>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {!projects && !error && (
        <div className="flex items-center gap-2 text-sm text-[#EDE8E0]/50 py-16 justify-center">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}

      {projects && projects.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center rounded-2xl border border-dashed border-[#EDE8E0]/15">
          <p className="text-sm text-[#EDE8E0]/60 max-w-sm">
            No projects yet. Create your first one, or import the site&apos;s sample projects to get started.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-1.5 text-sm px-5 py-2.5 rounded-full bg-[#5E9AA3] text-[#0B0C0C] font-medium hover:bg-[#5E9AA3]/90 transition-colors"
            >
              <Plus size={14} />
              New project
            </Link>
            <button
              type="button"
              onClick={handleImportSeed}
              disabled={importing}
              className="inline-flex items-center gap-1.5 text-sm px-5 py-2.5 rounded-full border border-[#5E9AA3]/50 text-[#5E9AA3] hover:bg-[#5E9AA3]/10 transition-colors disabled:opacity-50"
            >
              {importing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              Import sample projects
            </button>
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, index) => (
            <div
              key={p.id}
              className="group rounded-2xl border border-[#EDE8E0]/10 bg-[#EDE8E0]/[0.02] overflow-hidden flex flex-col"
            >
              <Link href={`/admin/projects/${p.id}`} className="block relative aspect-[16/10] bg-black/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.coverImage || "https://placehold.co/640x400?text=%20"}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full backdrop-blur ${
                    p.published ? "bg-[#5E9AA3]/80 text-[#0B0C0C]" : "bg-black/70 text-[#EDE8E0]/70"
                  }`}
                >
                  {p.published ? "Published" : "Draft"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFeatured(p);
                  }}
                  disabled={busyId === p.id}
                  title={p.featured ? "Unfeature" : "Feature"}
                  className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur transition-colors ${
                    p.featured ? "bg-[#5E9AA3]/80 text-[#0B0C0C]" : "bg-black/60 text-[#EDE8E0]/70 hover:text-[#EDE8E0]"
                  }`}
                >
                  <Star size={14} fill={p.featured ? "currentColor" : "none"} />
                </button>
              </Link>

              <div className="p-4 flex flex-col gap-3 flex-1">
                <Link href={`/admin/projects/${p.id}`} className="min-w-0">
                  <p className="text-sm text-[#EDE8E0] truncate hover:text-[#5E9AA3] transition-colors">
                    {p.title || "Untitled"}
                  </p>
                  <p className="text-xs text-[#EDE8E0]/40 truncate mt-0.5">
                    {p.scope} · {p.location} · {p.year ?? "Ongoing"}
                  </p>
                </Link>

                <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-[#EDE8E0]/10">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="p-1.5 rounded-full text-[#EDE8E0]/40 disabled:opacity-20 hover:text-[#EDE8E0] hover:bg-[#EDE8E0]/5 transition-colors"
                      aria-label="Move up"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === projects.length - 1}
                      className="p-1.5 rounded-full text-[#EDE8E0]/40 disabled:opacity-20 hover:text-[#EDE8E0] hover:bg-[#EDE8E0]/5 transition-colors"
                      aria-label="Move down"
                    >
                      <ChevronDown size={15} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => togglePublished(p)}
                      disabled={busyId === p.id}
                      className="text-xs px-3 py-1.5 rounded-full text-[#EDE8E0]/50 hover:text-[#EDE8E0] hover:bg-[#EDE8E0]/5 transition-colors"
                    >
                      {p.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(p)}
                      disabled={busyId === p.id}
                      className="p-1.5 rounded-full text-[#EDE8E0]/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
