import type { Metadata } from "next";
import AuthGuard from "@/components/admin/AuthGuard";

export const metadata: Metadata = {
  title: "Admin — Studio Envelope",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0C0C] text-[#EDE8E0]">
      <AuthGuard>{children}</AuthGuard>
    </div>
  );
}
