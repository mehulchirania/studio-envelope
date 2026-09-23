"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Loader2, Save, Trash2 } from "lucide-react";
import type { Project, ProjectScope } from "@/lib/types";
import {
  createProject,
  deleteProject,
  listAllProjects,
  slugify,
  triggerRevalidate,
  updateProject,
  type ProjectInput,
} from "@/lib/admin-api";
import ImageUploader from "./ImageUploader";
import FormSection from "./FormSection";
import Toggle from "./Toggle";

const SCOPES: ProjectScope[] = ["Interior", "Architecture & Interior"];
const STATUSES: Project["status"][] = ["Completed", "Ongoing"];

const inputClass =
  "w-full bg-[#EDE8E0]/[0.04] border border-[#EDE8E0]/15 rounded-lg px-3.5 py-2.5 text-[15px] text-[#EDE8E0] placeholder:text-[#EDE8E0]/30 focus:outline-none focus:border-[#5E9AA3]/60 transition-colors";
const labelClass = "block text-xs uppercase tracking-wider text-[#EDE8E0]/50 mb-1.5";

const WIZARD_STEPS = ["The basics", "The story", "Cover photo", "Publish"] as const;

function emptyProject(order: number): ProjectInput {
  return {
    slug: "",
    title: "",
    scope: "Interior",
    location: "",
    year: new Date().getFullYear(),
    area: "",
    status: "Completed",
    summary: "",
    description: "",
    coverImage: "",
    rooms: [],
    drawings: [],
    gallery: [],
    featured: false,
    order,
    published: false,
  };
}

export default function ProjectForm({ id, initial }: { id?: string; initial?: Project }) {
  const router = useRouter();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<ProjectInput>(() => (initial ? { ...initial } : emptyProject(0)));
  const slugTouched = useRef(isEdit); // in edit mode, don't auto-rewrite an existing slug
  const [showSlug, setShowSlug] = useState(false);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) return;
    listAllProjects()
      .then((projects) => setForm((f) => ({ ...f, order: projects.length })))
      .catch(() => {
        /* non-fatal: order defaults to 0 */
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: slugTouched.current ? f.slug : slugify(title),
    }));
  }

  function handleSlugChange(slug: string) {
    slugTouched.current = true;
    update("slug", slugify(slug));
  }

  function validateStep(index: number): string | null {
    if (index === 0) {
      if (!form.title.trim()) return "Give the project a title.";
      if (!form.slug.trim()) return "That title needs to produce a URL slug.";
      if (!form.location.trim()) return "Add a location.";
      if (form.year !== null && (!Number.isFinite(form.year) || form.year < 1900)) return "Enter a valid year.";
    }
    if (index === 1) {
      if (!form.summary.trim()) return "Add a one-line summary — it's what shows on project cards.";
      if (!form.description.trim()) return "Add the full description.";
    }
    if (index === 2) {
      if (!form.coverImage) return "Upload a cover photo.";
    }
    return null;
  }

  function validate(): string | null {
    for (let i = 0; i < 3; i++) {
      const err = validateStep(i);
      if (err) return err;
    }
    return null;
  }

  function goNext() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function save() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      // rooms/drawings editing isn't supported yet — `form` already carries
      // whatever the initial doc had (spread in useState above), untouched.
      const payload: ProjectInput = { ...form };

      if (isEdit && id) {
        await updateProject(id, payload);
      } else {
        await createProject(payload);
      }
      await triggerRevalidate();
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await save();
  }

  async function handleDelete() {
    if (!id) return;
    if (!window.confirm(`Delete "${form.title}"? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await deleteProject(id);
      await triggerRevalidate();
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project.");
      setDeleting(false);
    }
  }

  const basicsSection = (
    <FormSection title="The basics">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className={labelClass}>Title</label>
          <input
            className={inputClass}
            placeholder="e.g. James Residence"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          {!showSlug ? (
            <button
              type="button"
              onClick={() => setShowSlug(true)}
              className="mt-2 inline-flex items-center gap-1 text-xs text-[#EDE8E0]/40 hover:text-[#EDE8E0]/70 transition-colors"
            >
              <ChevronRight size={12} />
              URL: /projects/{form.slug || "…"} — edit
            </button>
          ) : (
            <div className="mt-2">
              <label className={labelClass}>URL slug</label>
              <input className={inputClass} value={form.slug} onChange={(e) => handleSlugChange(e.target.value)} />
            </div>
          )}
        </div>

        <div>
          <label className={labelClass}>Location</label>
          <input
            className={inputClass}
            placeholder="e.g. Hennur, Bangalore"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Scope</label>
          <select
            className={inputClass}
            value={form.scope}
            onChange={(e) => update("scope", e.target.value as ProjectScope)}
          >
            {SCOPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => update("status", e.target.value as Project["status"])}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Year</label>
          <input
            type="number"
            className={inputClass}
            value={form.year ?? ""}
            onChange={(e) => update("year", e.target.value === "" ? null : Number(e.target.value))}
          />
        </div>

        <div>
          <label className={labelClass}>Area (optional)</label>
          <input
            className={inputClass}
            placeholder="e.g. 2,400 sq.ft"
            value={form.area ?? ""}
            onChange={(e) => update("area", e.target.value)}
          />
        </div>
      </div>
    </FormSection>
  );

  const storySection = (
    <FormSection title="The story">
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Summary (1–2 sentences, shown on cards)</label>
          <textarea
            className={inputClass}
            rows={2}
            placeholder="A short, plain-English line describing this project."
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Description (long-form; separate paragraphs with a blank line)</label>
          <textarea
            className={inputClass}
            rows={8}
            placeholder="The full write-up that appears on the project page."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
      </div>
    </FormSection>
  );

  const coverSection = (
    <FormSection title="Cover photo" hint="The image shown on project cards and at the top of the project page.">
      <ImageUploader
        slug={form.slug}
        images={form.coverImage ? [form.coverImage] : []}
        onChange={(imgs) => update("coverImage", imgs[0] ?? "")}
        label="Cover image"
      />
      {isEdit && (
        <p className="text-xs text-[#EDE8E0]/40">
          Room-by-room photos and drawings aren&rsquo;t editable here yet — they&rsquo;re kept as-is from the
          existing document.
        </p>
      )}
    </FormSection>
  );

  const visibilitySection = (
    <FormSection title="Visibility">
      <div className="grid sm:grid-cols-2 gap-3">
        <Toggle
          checked={form.published}
          onChange={(v) => update("published", v)}
          label="Published"
          hint="Visible on the live site."
        />
        <Toggle
          checked={form.featured}
          onChange={(v) => update("featured", v)}
          label="Featured"
          hint="Highlighted on the homepage."
        />
      </div>
    </FormSection>
  );

  const headerActions = (
    <div className="flex items-center gap-2">
      {isEdit && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
        >
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          Delete
        </button>
      )}
    </div>
  );

  const errorBanner = error && (
    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
  );

  // Edit mode: everything on one page, since a quick tweak shouldn't require
  // paging through steps.
  if (isEdit) {
    return (
      <form onSubmit={handleSubmit} className="space-y-10 pb-16">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-light">Edit project</h1>
          <div className="flex items-center gap-2">
            {headerActions}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 text-sm px-5 py-2.5 rounded-full bg-[#5E9AA3] text-[#0B0C0C] font-medium hover:bg-[#5E9AA3]/90 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save
            </button>
          </div>
        </div>

        {errorBanner}

        <div className="space-y-10 divide-y divide-[#EDE8E0]/10 [&>*:not(:first-child)]:pt-10">
          {basicsSection}
          {storySection}
          {coverSection}
          {visibilitySection}
        </div>
      </form>
    );
  }

  // New project: a short guided flow, one thing at a time.
  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-xl font-light mb-5">New project</h1>
        <ol className="flex items-center gap-2 flex-wrap">
          {WIZARD_STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  i === step
                    ? "border-[#5E9AA3]/60 bg-[#5E9AA3]/10 text-[#5E9AA3]"
                    : i < step
                      ? "border-[#EDE8E0]/15 text-[#EDE8E0]/50"
                      : "border-[#EDE8E0]/10 text-[#EDE8E0]/30"
                }`}
              >
                {i < step ? <Check size={12} /> : <span className="tabular-nums">{i + 1}</span>}
                {label}
              </span>
              {i < WIZARD_STEPS.length - 1 && <span className="text-[#EDE8E0]/15">—</span>}
            </li>
          ))}
        </ol>
      </div>

      {errorBanner}

      <div className="min-h-[20rem]">
        {step === 0 && basicsSection}
        {step === 1 && storySection}
        {step === 2 && coverSection}
        {step === 3 && (
          <div className="space-y-8">
            {visibilitySection}
            <div className="rounded-xl border border-[#EDE8E0]/10 p-4 space-y-1.5 text-sm text-[#EDE8E0]/70">
              <p className="text-[#EDE8E0]">{form.title || "Untitled"}</p>
              <p>
                {form.scope} · {form.location || "—"} · {form.year ?? "Ongoing"}
              </p>
              <p className="text-[#EDE8E0]/50">{form.summary}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#EDE8E0]/10">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-full border border-[#EDE8E0]/15 text-[#EDE8E0]/70 hover:bg-[#EDE8E0]/5 transition-colors disabled:opacity-0 disabled:pointer-events-none"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        {step < WIZARD_STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-1.5 text-sm px-5 py-2.5 rounded-full bg-[#5E9AA3] text-[#0B0C0C] font-medium hover:bg-[#5E9AA3]/90 transition-colors"
          >
            Next
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 text-sm px-5 py-2.5 rounded-full bg-[#5E9AA3] text-[#0B0C0C] font-medium hover:bg-[#5E9AA3]/90 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save project
          </button>
        )}
      </div>
    </div>
  );
}
