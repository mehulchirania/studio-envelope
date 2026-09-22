import clsx from "clsx";

type DatasheetItem = { label: string; value: string };

/** A horizontal row of label/value facts (Location · Area · Scope · Year),
 * separated by hairlines. Wraps to a stacked list on small screens. Works on
 * both bone ("light") and dark grounds via `tone`. */
export default function Datasheet({
  items,
  className,
  tone = "light",
}: {
  items: DatasheetItem[];
  className?: string;
  tone?: "dark" | "light";
}) {
  const hairline = tone === "dark" ? "border-hairline-light" : "border-hairline";
  return (
    <dl className={clsx("flex flex-wrap gap-x-10 gap-y-5 border-y py-6", hairline, className)}>
      {items.map((item, i) => (
        <div key={item.label + i} className={clsx("min-w-[8rem] border-l pl-5 first:border-l-0 first:pl-0", hairline)}>
          <dt className={clsx("label mb-1", tone === "dark" && "text-mist")}>{item.label}</dt>
          <dd className={clsx("font-sans text-[15px]", tone === "dark" ? "text-bone" : "text-ink")}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
