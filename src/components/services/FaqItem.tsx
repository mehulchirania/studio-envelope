import { Plus } from "lucide-react";

/** FAQ row built on the native <details> element: keyboard and screen-reader
 * accessible, works without JavaScript, and the plus turns to a cross when open. */
export default function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-hairline">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
        <h3 className="font-display text-xl text-ink sm:text-2xl">{q}</h3>
        <Plus size={18} aria-hidden="true" className="shrink-0 text-teal transition-transform group-open:rotate-45" />
      </summary>
      <p className="max-w-2xl pb-6 text-base leading-relaxed text-muted">{a}</p>
    </details>
  );
}
