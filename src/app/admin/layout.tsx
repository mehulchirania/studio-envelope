import type { Metadata } from "next";
import AuthGuard from "@/components/admin/AuthGuard";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bone text-ink">
      <AuthGuard>{children}</AuthGuard>
    </div>
  );
}
