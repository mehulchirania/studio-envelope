import type { Metadata } from "next";
import AuthGuard from "@/components/admin/AuthGuard";
import AdminThemeRoot from "@/components/admin/AdminThemeRoot";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeRoot>
      <AuthGuard>{children}</AuthGuard>
    </AdminThemeRoot>
  );
}
