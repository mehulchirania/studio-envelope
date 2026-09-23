"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, ImagePlus, Loader2, Repeat, X } from "lucide-react";
import { deleteProjectImageByUrl, uploadProjectImage } from "@/lib/admin-api";

interface ImageUploaderProps {
  /** Storage path segment — usually the project slug. Uploads are blocked until this is non-empty. */
  slug: string;
  images: string[];
  onChange: (images: string[]) => void;
  /** When false, exactly one image is kept (a new upload replaces it). */
  multiple?: boolean;
  label: string;
  hint?: string;
}

interface PendingUpload {
  id: string;
  name: string;
  progress: number;
}

const MAX_BYTES = 10 * 1024 * 1024;

export default function ImageUploader({ slug, images, onChange, multiple = false, label, hint }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!slug) {
      setError("Add a title first so images have somewhere to live.");
      return;
    }
    setError(null);
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" is not an image.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(`"${file.name}" is larger than 10MB.`);
        continue;
      }
      const id = `${Date.now()}-${file.name}`;
      setPending((prev) => [...prev, { id, name: file.name, progress: 0 }]);
      try {
        const { url } = await uploadProjectImage(slug, file, (pct) => {
          setPending((prev) => prev.map((p) => (p.id === id ? { ...p, progress: pct } : p)));
        });
        onChange(multiple ? [...images, url] : [url]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setPending((prev) => prev.filter((p) => p.id !== id));
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(index: number) {
    const url = images[index];
    onChange(images.filter((_, i) => i !== index));
    // Best-effort: only removes Blob-hosted images; ignores seed/external URLs.
    void deleteProjectImageByUrl(url);
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  const showSingleDropzone = !multiple && images.length === 0;
  const showMultiDropzone = multiple;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-sm text-[#EDE8E0]">{label}</span>
          {hint && <span className="block text-xs text-[#EDE8E0]/45 mt-0.5">{hint}</span>}
        </div>
        {!showSingleDropzone && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#5E9AA3]/50 text-[#5E9AA3] hover:bg-[#5E9AA3]/10 transition-colors shrink-0"
          >
            <ImagePlus size={14} />
            {multiple ? "Add images" : "Replace image"}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {pending.map((p) => (
        <div key={p.id} className="flex items-center gap-2 text-xs text-[#EDE8E0]/60">
          <Loader2 size={14} className="animate-spin" />
          <span className="truncate max-w-[12rem]">{p.name}</span>
          <span className="ml-auto tabular-nums">{p.progress}%</span>
        </div>
      ))}

      {showSingleDropzone && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          className={`flex flex-col items-center justify-center gap-2 aspect-[16/9] rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            dragging
              ? "border-[#5E9AA3] bg-[#5E9AA3]/10"
              : "border-[#EDE8E0]/15 hover:border-[#EDE8E0]/30 bg-[#EDE8E0]/[0.02]"
          }`}
        >
          <ImagePlus size={22} className="text-[#EDE8E0]/40" />
          <p className="text-sm text-[#EDE8E0]/60">Drag a photo here, or click to browse</p>
          <p className="text-xs text-[#EDE8E0]/35">JPG or PNG, up to 10MB</p>
        </div>
      )}

      {!multiple && images.length > 0 && (
        <div className="relative group rounded-xl overflow-hidden border border-[#EDE8E0]/10 aspect-[16/9] bg-black/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-[#0B0C0C]/80 hover:bg-[#5E9AA3]/80 transition-colors"
            >
              <Repeat size={13} />
              Replace
            </button>
            <button
              type="button"
              onClick={() => remove(0)}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-[#0B0C0C]/80 hover:bg-red-500/80 transition-colors"
            >
              <X size={13} />
              Remove
            </button>
          </div>
        </div>
      )}

      {showMultiDropzone && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          className={`flex items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            dragging
              ? "border-[#5E9AA3] bg-[#5E9AA3]/10"
              : "border-[#EDE8E0]/15 hover:border-[#EDE8E0]/30 bg-[#EDE8E0]/[0.02]"
          }`}
        >
          <ImagePlus size={18} className="text-[#EDE8E0]/40" />
          <p className="text-sm text-[#EDE8E0]/60">Drag photos here, or click to browse</p>
        </div>
      )}

      {multiple && images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div
              key={url + index}
              className="relative group rounded-lg overflow-hidden border border-[#EDE8E0]/10 aspect-[4/3] bg-black/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label="Remove image"
                  className="p-1.5 rounded-full bg-black/70 hover:bg-red-500/80 transition-colors"
                >
                  <X size={14} />
                </button>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Move earlier"
                    className="p-1 rounded bg-black/70 disabled:opacity-30 hover:bg-white/10 transition-colors"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    aria-label="Move later"
                    className="p-1 rounded bg-black/70 disabled:opacity-30 hover:bg-white/10 transition-colors"
                  >
                    <ChevronDown size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
