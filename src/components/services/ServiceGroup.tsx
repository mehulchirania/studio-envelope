type ServiceRow = { name: string; description: string };

type ServiceGroupProps = {
  /** Stage name, e.g. "Design". */
  name: string;
  rows: ServiceRow[];
};

/** One stage of the services list: the stage name and each service with its
 * description clearly visible. */
export default function ServiceGroup({ name, rows }: ServiceGroupProps) {
  return (
    <div className="grid gap-6 border-t border-hairline pt-8 lg:grid-cols-[16rem_1fr] lg:gap-16">
      <h3 className="font-display text-3xl font-light text-ink">{name}</h3>

      <ul className="max-w-3xl">
        {rows.map((row) => (
          <li key={row.name} className="border-t border-hairline py-5 first:border-t-0 first:pt-0">
            <p className="font-display text-2xl text-ink sm:text-3xl">{row.name}</p>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">{row.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
