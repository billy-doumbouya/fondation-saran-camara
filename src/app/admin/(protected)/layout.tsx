import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProtectedAdminHeader from "@/components/admin/ProtectedAdminHeader";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <AdminSidebar />

      <div className="min-w-0 lg:pl-64">
        <ProtectedAdminHeader />
        <main className="overflow-x-hidden px-4 py-7 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
