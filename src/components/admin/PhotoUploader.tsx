"use client";

import { useRef, useState, type DragEvent } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Repeat, Star, Trash2, X } from "lucide-react";
import { uploadImage, type UploadedImage } from "@/lib/admin/client";

const MAX_BYTES = 25 * 1024 * 1024;

interface Pending {
  id: string;
  name: string;
  progress: number;
}

/** Uploads files one by one, tracking progress and surfacing a friendly error for bad files. */
function useImageUploads(folder: string) {
  const [pending, setPending] = useState<Pending[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function uploadFiles(files: FileList | File[] | null): Promise<UploadedImage[]> {
    const list = files ? Array.from(files) : [];
    if (list.length === 0) return [];
    setError(null);

    const done: UploadedImage[] = [];
    for (const file of list) {
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" isn't an image.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(`"${file.name}" is larger than 25MB.`);
        continue;
      }
      const id = `${Date.now()}-${file.name}`;
      setPending((p) => [...p, { id, name: file.name, progress: 0 }]);
      try {
        done.push(
          await uploadImage(folder, file, (progress) =>
            setPending((p) => p.map((item) => (item.id === id ? { ...item, progress } : item)))
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setPending((p) => p.filter((item) => item.id !== id));
      }
    }
    return done;
  }

  return { pending, error, uploadFiles };
}

function UploadStatus({ pending, error }: { pending: Pending[]; error: string | null }) {
  return (
    <>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {pending.map((p) => (
        <div key={p.id} className="flex items-center gap-2 text-xs text-muted">
          <Loader2 size={14} className="animate-spin" />
          <span className="truncate max-w-[14rem]">{p.name}</span>
          <span className="ml-auto tabular-nums">{Math.round(p.progress)}%</span>
        </div>
      ))}
    </>
  );
}

function useDropzone(onFiles: (files: FileList) => void) {
  const [dragging, setDragging] = useState(false);
  return {
    dragging,
    handlers: {
      onDragOver: (e: DragEvent) => {
        e.preventDefault();
        setDragging(true);
      },
      onDragLeave: () => setDragging(false),
      onDrop: (e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
        onFiles(e.dataTransfer.files);
      },
    },
  };
}

// ---------- Cover image (exactly one) ----------

export function CoverUploader({
  folder,
  value,
  onChange,
}: {
  folder: string;
  value: string;
  onChange: (src: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { pending, error, uploadFiles } = useImageUploads(folder);

  async function handleFiles(files: FileList | null) {
    const [first] = await uploadFiles(files ? [files[0]] : null);
    if (first) onChange(first.src);
    if (inputRef.current) inputRef.current.value = "";
  }

  const { dragging, handlers } = useDropzone(handleFiles);

  return (
    <div className="max-w-md space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-hairline bg-ink/10 aspect-[16/9]" {...handlers}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-night/80 text-bone hover:bg-teal/90 transition-colors"
            >
              <Repeat size={13} /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-night/80 text-bone hover:bg-red-700/90 transition-colors"
            >
              <X size={13} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          {...handlers}
          className={`w-full flex flex-col items-center justify-center gap-2 aspect-[16/9] rounded-xl border-2 border-dashed transition-colors ${
            dragging ? "border-teal bg-teal/15" : "border-ink/25 hover:border-ink/50 bg-ink/[0.05]"
          }`}
        >
          <ImagePlus size={22} className="text-muted" />
          <span className="text-sm text-ink">Drag a photo here, or click to choose one</span>
        </button>
      )}

      <UploadStatus pending={pending} error={error} />
    </div>
  );
}

// ---------- Many photos (a room, or drawings) ----------

export interface PhotoItem {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Room photos are either real photographs or 3D visualisations (the public site labels the latter). */
  kind?: "photo" | "render";
}

export function PhotoGrid<T extends PhotoItem>({
  folder,
  items,
  onItemsChange,
  onAdd,
  coverSrc,
  onSetCover,
  showKind = false,
  addLabel = "Add photos",
}: {
  folder: string;
  items: T[];
  onItemsChange: (items: T[]) => void;
  onAdd: (uploaded: UploadedImage[]) => void;
  coverSrc?: string;
  onSetCover?: (src: string) => void;
  showKind?: boolean;
  addLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { pending, error, uploadFiles } = useImageUploads(folder);

  async function handleFiles(files: FileList | null) {
    const uploaded = await uploadFiles(files);
    if (uploaded.length > 0) onAdd(uploaded);
    if (inputRef.current) inputRef.current.value = "";
  }

  const { dragging, handlers } = useDropzone(handleFiles);

  function patch(index: number, change: Partial<PhotoItem>) {
    onItemsChange(items.map((item, i) => (i === index ? { ...item, ...change } : item)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onItemsChange(next);
  }

  const iconButton =
    "p-2 rounded-full text-muted hover:text-ink hover:bg-ink/10 transition-colors disabled:opacity-25 disabled:pointer-events-none";

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {items.map((item, index) => (
            <div key={item.src} className="rounded-xl border border-hairline bg-ink/[0.05] overflow-hidden">
              <div className="relative aspect-[4/3] bg-ink/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                {coverSrc === item.src && (
                  <span className="absolute top-2 left-2 text-[11px] px-2 py-0.5 rounded-full bg-night text-bone">
                    Cover
                  </span>
                )}
              </div>
              <div className="p-2 space-y-1">
                <input
                  value={item.alt}
                  onChange={(e) => patch(index, { alt: e.target.value })}
                  placeholder="Describe this photo"
                  aria-label="Photo description"
                  className="w-full bg-transparent border-b border-hairline px-1 py-1.5 text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-teal"
                />
                {showKind && (
                  <select
                    value={item.kind ?? "photo"}
                    onChange={(e) => patch(index, { kind: e.target.value === "render" ? "render" : "photo" })}
                    aria-label="Photo type"
                    className="w-full bg-bone border border-hairline rounded px-1.5 py-1 text-xs text-ink"
                  >
                    <option value="photo">Photograph</option>
                    <option value="render">Visualisation (3D render)</option>
                  </select>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <button type="button" className={iconButton} onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move earlier">
                      <ArrowLeft size={14} />
                    </button>
                    <button
                      type="button"
                      className={iconButton}
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label="Move later"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="flex">
                    {onSetCover && (
                      <button
                        type="button"
                        className={iconButton}
                        onClick={() => onSetCover(item.src)}
                        disabled={coverSrc === item.src}
                        aria-label="Use as cover"
                        title="Use as cover"
                      >
                        <Star size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      className={`${iconButton} hover:!text-red-700`}
                      onClick={() => onItemsChange(items.filter((_, i) => i !== index))}
                      aria-label="Remove photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        {...handlers}
        className={`w-full flex items-center justify-center gap-2 py-5 rounded-xl border-2 border-dashed text-sm transition-colors ${
          dragging
            ? "border-teal bg-teal/15 text-ink"
            : "border-ink/25 hover:border-ink/50 text-ink bg-ink/[0.05]"
        }`}
      >
        <ImagePlus size={16} />
        {addLabel} <span className="text-muted">— drag here or click</span>
      </button>

      <UploadStatus pending={pending} error={error} />
    </div>
  );
}
