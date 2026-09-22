type DatasheetItem = { label: string; value: string };

/** A horizontal row of label/value facts (Location · Area · Scope · Year),
 * separated by hairlines. Wraps to a stacked list on small screens. */
export default function Datasheet({ items, className }: { items: DatasheetItem[]; className?: string }) {
  return (
    <dl className={`flex flex-wrap gap-x-10 gap-y-5 border-y border-hairline py-6 ${className ?? ""}`}>
      {items.map((item, i) => (
        <div
          key={item.label + i}
          className="min-w-[8rem] border-l border-hairline pl-5 first:border-l-0 first:pl-0"
        >
          <dt className="label mb-1">{item.label}</dt>
          <dd className="font-sans text-[15px] text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
