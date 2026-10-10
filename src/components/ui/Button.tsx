import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

type Variant = "round" | "solid";

type ButtonProps = {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const base =
  "inline-flex items-center justify-center transition-colors focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  /** Round marigold call to action (footer "Enquire"). */
  round: "flex-col gap-1 rounded-full bg-marigold px-2 text-center text-abyss hover:bg-bone",
  /** Square brown action used for form submission. */
  solid: "min-h-12 gap-3 bg-teal px-8 py-3.5 text-sm uppercase tracking-[0.16em] text-bone hover:bg-teal-deep",
};

/** The site's one button: a link when `href` is given, otherwise a button
 * (type defaults to "submit" inside forms, as for any <button>). */
export default function Button({ variant = "solid", href, children, className, ...rest }: ButtonProps) {
  const classes = clsx(base, variants[variant], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
