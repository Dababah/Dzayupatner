import { AdminSidebar } from "@/components/layouts/admin-sidebar";

export const metadata = {
  title: "Admin – dzayupatner",
  description: "Panel admin untuk mengelola order dan klien dzayupatner.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
