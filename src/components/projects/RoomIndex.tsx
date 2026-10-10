"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

type RoomLink = { id: string; name: string };

/** Room navigation for a project detail page. Desktop: a small fixed abyss/80
 * pill of dots floating on the right edge, always legible since it sits above
 * whichever band (bone or night) is currently scrolled past — no inline
 * column needed now that each room is its own full-width band. Mobile: a
 * horizontal chip list placed once, above the first room. Both read from the
 * same `active` state (via IntersectionObserver) so they stay in sync. */
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
      <nav
        aria-label="Rooms in this project"
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 rounded-full bg-abyss/80 px-2.5 py-4 backdrop-blur-sm lg:block"
      >
        <ul className="flex flex-col items-center gap-4">
          {rooms.map((room) => (
            <li key={room.id} className="group relative">
              <a
                href={`#${room.id}`}
                aria-current={active === room.id ? "true" : undefined}
                aria-label={room.name}
                className={clsx(
                  "block h-2 w-2 rounded-full transition-colors",
                  active === room.id ? "bg-marigold" : "bg-bone/35 hover:bg-bone/70"
                )}
              />
              <span
                className="label pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap bg-abyss/90 px-2.5 py-1 text-bone opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              >
                {room.name}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Rooms in this project" className="band-bone -mx-0 overflow-x-auto px-5 py-6 lg:hidden">
        <ul className="flex gap-2">
          {rooms.map((room) => (
            <li key={room.id} className="shrink-0">
              <a
                href={`#${room.id}`}
                aria-current={active === room.id ? "true" : undefined}
                className={clsx(
                  "label inline-block whitespace-nowrap border px-3 py-3 transition-colors",
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
