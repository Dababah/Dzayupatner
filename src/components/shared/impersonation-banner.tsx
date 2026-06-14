"use client";

import { useAuth } from "@/hooks/use-auth";
import { X } from "lucide-react";

/**
 * ImpersonationBanner – Banner oranye mencolok saat admin sedang impersonasi klien
 * Letakkan di layout dashboard klien
 */
export function ImpersonationBanner() {
  const { isImpersonating, impersonatedUser, exitImpersonation } = useAuth();

  if (!isImpersonating || !impersonatedUser) return null;

  return (
    <div className="w-full bg-orange-500 text-white px-4 py-2.5 flex items-center justify-between text-sm font-medium z-50 sticky top-0">
      <span>
        👁️ Mode Impersonasi: Anda sedang melihat dashboard atas nama{" "}
        <strong>{impersonatedUser.name}</strong>
      </span>
      <button
        onClick={exitImpersonation}
        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 transition-colors rounded px-2.5 py-1 text-xs font-semibold"
      >
        <X className="h-3 w-3" />
        Keluar dari Mode Impersonasi
      </button>
    </div>
  );
}
