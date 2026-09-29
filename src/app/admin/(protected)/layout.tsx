import type { ReactNode } from "react";
import Script from "next/script";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProtectedAdminHeader from "@/components/admin/ProtectedAdminHeader";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans selection:bg-gold-500 selection:text-navy-950">
      {/* Chargement global unique du widget Cloudinary pour tout le back-office */}
      <Script
        id="cloudinary-upload-widget"
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
      />

      <AdminSidebar />

      <div className="min-w-0 lg:pl-64">
        <ProtectedAdminHeader />
        <main className="overflow-x-hidden px-4 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
