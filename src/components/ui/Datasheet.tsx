import clsx from "clsx";

type DatasheetItem = { label: string; value: string };

/** Label/value facts (Location, Area, Scope, Status). A two-column grid on
 * phones, a single hairline-divided row from `md` up. Works on bone
 * ("light") and dark grounds via `tone`. */
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
    <dl className={clsx("grid grid-cols-2 gap-x-6 gap-y-5 border-y py-5 md:flex md:flex-wrap md:gap-x-10 md:py-6", hairline, className)}>
      {items.map((item) => (
        <div key={item.label} className={clsx("min-w-0 md:min-w-[8rem] md:border-l md:pl-5 md:first:border-l-0 md:first:pl-0", hairline)}>
          <dt className={clsx("label mb-1", tone === "dark" && "text-mist")}>{item.label}</dt>
          <dd className={clsx("text-[15px]", tone === "dark" ? "text-bone" : "text-ink")}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
