import { ImpersonationBanner } from "@/components/shared/impersonation-banner";
import { ClientSidebar } from "@/components/layouts/client-sidebar";

export const metadata = {
  title: "Dashboard – dzayupatner",
  description: "Pantau status dan progres order layanan akademik Anda.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <ClientSidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <ImpersonationBanner />
        <main className="flex-1">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
