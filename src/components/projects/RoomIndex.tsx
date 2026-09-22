"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

type RoomLink = { id: string; name: string };

/** Room navigation for a project detail page: a sticky column of links on
 * desktop (current room highlighted via IntersectionObserver) and a
 * horizontal scrollable chip list on mobile. Both read from the same
 * `active` state so they stay in sync if the viewport changes. */
export default function RoomIndex({ rooms }: { rooms: RoomLink[] }) {
  const [active, setActive] = useState<string | null>(rooms[0]?.id ?? null);

  useEffect(() => {
    if (rooms.length === 0) return;
    const elements = rooms
      .map((room) => document.getElementById(room.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top <= b.boundingClientRect.top ? a : b));
        setActive(topMost.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [rooms]);

  if (rooms.length === 0) return null;

  return (
    <>
      <nav aria-label="Rooms in this project" className="sticky top-32 hidden self-start lg:block">
        <p className="label mb-4">Rooms</p>
        <ul className="space-y-3">
          {rooms.map((room) => (
            <li key={room.id}>
              <a
                href={`#${room.id}`}
                aria-current={active === room.id ? "true" : undefined}
                className={clsx(
                  "block border-l-2 pl-4 text-[15px] leading-snug transition-colors",
                  active === room.id ? "border-teal text-ink" : "border-hairline text-muted hover:text-ink"
                )}
              >
                {room.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Rooms in this project" className="-mx-5 mb-10 overflow-x-auto px-5 lg:hidden">
        <ul className="flex gap-2">
          {rooms.map((room) => (
            <li key={room.id} className="shrink-0">
              <a
                href={`#${room.id}`}
                aria-current={active === room.id ? "true" : undefined}
                className={clsx(
                  "label inline-block whitespace-nowrap border px-3 py-2 transition-colors",
                  active === room.id ? "border-teal text-teal" : "border-hairline text-muted"
                )}
              >
                {room.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
