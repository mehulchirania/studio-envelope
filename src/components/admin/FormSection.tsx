import type { ReactNode } from "react";

export default function FormSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-base text-[#EDE8E0]">{title}</h2>
        {hint && <p className="text-sm text-[#EDE8E0]/45 mt-1">{hint}</p>}
      </div>
      {children}
    </section>
  );
}
