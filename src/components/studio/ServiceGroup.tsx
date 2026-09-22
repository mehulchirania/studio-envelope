"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

type ServiceRow = { name: string; description: string };

type ServiceGroupProps = {
  /** Group label, e.g. "Design". */
  name: string;
  rows: ServiceRow[];
  /** Running number (1-based) the first row starts at, so numbering is
   * continuous 01-10 across the three groups. */
  startIndex: number;
  image: { src: string; alt: string; width: number; height: number };
};

/** One stage of the services list: a small preview image that dims/brightens
 * as the visitor hovers rows in the group, and rows whose number turns
 * marigold and whose description opens/brightens on hover or focus. */
export default function ServiceGroup({ name, rows, startIndex, image }: ServiceGroupProps) {
  const [active, setActive] = useState(false);

  return (
    <div className="grid gap-8 border-t border-hairline pt-8 lg:grid-cols-[1fr_auto] lg:gap-14">
      <div>
        <p className="label text-teal">{name}</p>
        <ul className="mt-4">
          {rows.map((row, i) => {
            const n = String(startIndex + i).padStart(2, "0");
            return (
              <li
                key={row.name}
                className="group border-t border-hairline py-5 first:border-t-0 focus-within:[&_.svc-desc]:opacity-100"
                onMouseEnter={() => setActive(true)}
                onMouseLeave={() => setActive(false)}
                tabIndex={0}
              >
                <div className="flex items-baseline gap-5">
                  <span className="label w-8 shrink-0 text-muted transition-colors duration-300 group-hover:text-marigold group-focus-within:text-marigold">
                    {n}
                  </span>
                  <p className="font-display text-2xl text-ink transition-colors duration-300 group-hover:text-teal sm:text-3xl">
                    {row.name}
                  </p>
                </div>
                <p className="svc-desc mt-2 max-w-lg pl-13 text-base leading-relaxed text-muted opacity-60 transition-opacity duration-300 group-hover:opacity-100 sm:pl-[52px]">
                  {row.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="hidden w-48 shrink-0 self-start overflow-hidden bg-paper-2 lg:block">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="192px"
          className={clsx(
            "h-64 w-48 object-cover transition-all duration-500",
            active ? "scale-105 opacity-100" : "scale-100 opacity-70"
          )}
        />
      </div>
    </div>
  );
}
