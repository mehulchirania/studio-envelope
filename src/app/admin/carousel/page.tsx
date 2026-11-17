"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, RotateCcw, Trash2 } from "lucide-react";
import type { CarouselImage } from "@/lib/admin/types";
import { getCarousel, resetCarousel, saveCarousel, uploadImage } from "@/lib/admin/client";

const MAX_BYTES = 25 * 1024 * 1024;

export default function AdminCarouselPage() {
  const [images, setImages] = useState<CarouselImage[] | null>(null);
  const [saved, setSaved] = useState<CarouselImage[] | null>(null);
  const [projectPhotos, setProjectPhotos] = useState<CarouselImage[]>([]);
  const [custom, setCustom] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await getCarousel();
      setProjectPhotos(data.projectPhotos);
      setSaved(data.saved);
      setCustom(data.saved !== null);
      setImages(data.saved ?? data.projectPhotos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load the carousel.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    void load();
  }, [load]);

  const list = images ?? [];
  const dirty = images !== null && JSON.stringify(images) !== JSON.stringify(saved ?? projectPhotos);

  function remove(src: string) {
    setNotice(null);
    setImages((current) => (current ?? []).filter((i) => i.src !== src));
  }

  async function addFiles(files: FileList | null) {
    const chosen = files ? Array.from(files) : [];
    if (inputRef.current) inputRef.current.value = "";
    setError(null);
    setNotice(null);
    for (const file of chosen) {
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" isn't an image.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(`"${file.name}" is larger than 25MB.`);
        continue;
      }
      setUploading((u) => [...u, file.name]);
      try {
        const { src } = await uploadImage("photos", file, undefined, "home-carousel");
        setImages((current) => [...(current ?? []), { src, alt: "" }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setUploading((u) => u.filter((n) => n !== file.name));
      }
    }
  }

  async function save() {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await saveCarousel(list);
      setNotice(list.length === 0 ? "Back to showing every project photograph." : "Saved. The home page carousel is updated.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save.");
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    if (!window.confirm("Go back to showing a random selection of every project photograph? Photos you uploaded here are deleted.")) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await resetCarousel();
      setNotice("Back to showing every project photograph.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reset.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-light">Home carousel</h1>
          <p className="text-sm text-muted mt-1 max-w-xl">
            The photographs in &ldquo;A glimpse of our work&rdquo; on the home page.{" "}
            {custom
              ? "You're showing this exact list, in this order."
              : "Until you save a list, the site shows a random selection from every project photograph. Remove the ones you don't want, add your own, then save."}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {custom && (
            <button
              type="button"
              onClick={reset}
              disabled={busy}
              className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-full border border-hairline text-muted hover:text-ink hover:bg-ink/10 transition-colors disabled:opacity-40"
            >
              <RotateCcw size={15} /> Use all project photos
            </button>
          )}
          <button
            type="button"
            onClick={save}
            disabled={busy || !dirty || uploading.length > 0}
            className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full a-pri font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {busy && <Loader2 size={15} className="animate-spin" />} Save changes
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="text-sm text-ink bg-ink/[0.06] border border-hairline rounded-lg px-3 py-2">
          {notice}
        </p>
      )}

      {!images && !error && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted py-16">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}

      {images && (
        <>
          <p className="text-sm text-muted">
            {list.length} {list.length === 1 ? "photo" : "photos"}
            {dirty && " · unsaved changes"}
          </p>

          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {list.map((image) => (
              <li key={image.src} className="group relative overflow-hidden rounded-xl border border-hairline bg-ink/10 aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt={image.alt} loading="lazy" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => remove(image.src)}
                  aria-label={`Remove ${image.alt || "this photo"}`}
                  className="absolute top-2 right-2 inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-night/80 text-bone hover:bg-red-700/90 transition-colors"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </li>
            ))}
            {uploading.map((name) => (
              <li key={name} className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink/25 aspect-[4/5] text-xs text-muted">
                <Loader2 size={18} className="animate-spin" />
                <span className="px-2 truncate max-w-full">{name}</span>
              </li>
            ))}
            <li>
              <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => void addFiles(e.target.files)} />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full h-full min-h-32 aspect-[4/5] flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/25 hover:border-ink/50 bg-ink/[0.05] text-sm text-ink transition-colors"
              >
                <ImagePlus size={22} className="text-muted" />
                Add photos
              </button>
            </li>
          </ul>

          {list.length === 0 && (
            <p className="text-sm text-muted">
              No photos left. Saving now will put the site back to showing every project photograph.
            </p>
          )}
        </>
      )}
    </div>
  );
}
