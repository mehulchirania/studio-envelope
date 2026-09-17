import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center px-5 py-32 text-center">
      <Logo size="md" wordmark={false} />
      <p className="eyebrow mt-10 mb-4">404</p>
      <h1 className="font-display text-4xl text-fg sm:text-6xl">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-6 max-w-md text-base text-muted">
        The page you&apos;re looking for may have moved or never existed.
        Let&apos;s get you back to somewhere we&apos;ve actually built.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 border border-fg px-8 py-3.5 text-sm uppercase tracking-[0.18em] text-fg transition-colors hover:bg-fg hover:text-ink"
      >
        Back to home
        <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
