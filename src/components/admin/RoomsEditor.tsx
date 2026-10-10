"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { Room, RoomImage } from "@/lib/content/types";
import { PhotoGrid } from "@/components/admin/PhotoUploader";

const iconButton =
  "p-2.5 rounded-full text-[#EDE8E0]/50 hover:text-[#EDE8E0] hover:bg-[#EDE8E0]/10 transition-colors disabled:opacity-25 disabled:pointer-events-none";

export default function RoomsEditor({
  folder,
  rooms,
  onChange,
  coverSrc,
  onSetCover,
}: {
  folder: string;
  rooms: Room[];
  onChange: (rooms: Room[]) => void;
  coverSrc: string;
  onSetCover: (src: string) => void;
}) {
  function patchRoom(index: number, change: Partial<Room>) {
    onChange(rooms.map((room, i) => (i === index ? { ...room, ...change } : room)));
  }

  function moveRoom(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rooms.length) return;
    const next = [...rooms];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function removeRoom(index: number) {
    const room = rooms[index];
    if (room.images.length > 0 && !window.confirm(`Remove "${room.name || "this room"}" and its ${room.images.length} photo(s)?`)) return;
    onChange(rooms.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-5">
      {rooms.map((room, index) => (
        <div key={index} className="rounded-2xl border border-[#EDE8E0]/10 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <input
              value={room.name}
              onChange={(e) => patchRoom(index, { name: e.target.value })}
              placeholder="Room name, e.g. Kitchen & Dining"
              aria-label="Room name"
              className="flex-1 min-w-0 bg-[#EDE8E0]/[0.04] border border-[#EDE8E0]/15 rounded-lg px-3.5 py-2.5 text-[15px] text-[#EDE8E0] placeholder:text-[#EDE8E0]/30 focus:outline-none focus:border-[#5E9AA3]/60"
            />
            <button type="button" className={iconButton} onClick={() => moveRoom(index, -1)} disabled={index === 0} aria-label="Move room up">
              <ArrowUp size={16} />
            </button>
            <button
              type="button"
              className={iconButton}
              onClick={() => moveRoom(index, 1)}
              disabled={index === rooms.length - 1}
              aria-label="Move room down"
            >
              <ArrowDown size={16} />
            </button>
            <button type="button" className={`${iconButton} hover:!text-red-400`} onClick={() => removeRoom(index)} aria-label="Remove room">
              <Trash2 size={16} />
            </button>
          </div>

          <PhotoGrid<RoomImage>
            folder={folder}
            items={room.images}
            onItemsChange={(images) => patchRoom(index, { images })}
            onAdd={(uploaded) => {
              const kind = room.images[room.images.length - 1]?.kind ?? "photo";
              patchRoom(index, { images: [...room.images, ...uploaded.map((u) => ({ ...u, alt: "", kind }))] });
            }}
            coverSrc={coverSrc}
            onSetCover={onSetCover}
            showKind
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...rooms, { name: "", images: [] }])}
        className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full border border-[#5E9AA3]/50 text-[#5E9AA3] hover:bg-[#5E9AA3]/10 transition-colors"
      >
        <Plus size={15} />
        Add a room
      </button>
    </div>
  );
}
