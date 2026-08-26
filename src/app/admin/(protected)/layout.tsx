import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = { robots: { index: false, follow: false } };

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-navy-50/40">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden px-4 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
