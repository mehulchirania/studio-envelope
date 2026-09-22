import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center px-5 py-32 text-center">
      <Logo variant="teal" showWordmark={false} />
      <p className="label mt-10 mb-4">404</p>
      <h1 className="h1 text-ink">This page doesn&apos;t exist</h1>
      <p className="mt-6 max-w-md text-base text-muted">
        The page you&apos;re looking for may have moved or never existed.
        Let&apos;s get you back to somewhere we&apos;ve actually built.
      </p>
      <Link href="/" className="link-arrow mt-10">
        Back to home
        <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
