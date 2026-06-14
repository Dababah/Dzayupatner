"use client";

import { useState, useCallback } from "react";
import { User } from "@/lib/prisma-types-mock";

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isImpersonating: boolean;
  impersonatedUser: User | null;
}

/**
 * useAuth – Enkapsulasi manajemen session & impersonasi
 * Dalam implementasi produksi, sambungkan ke NextAuth.js atau library autentikasi pilihan.
 */
export function useAuth() {
  const [authState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    isImpersonating: false,
    impersonatedUser: null,
  });

  /**
   * Impersonasi: Admin melihat dashboard atas nama klien.
   * Token admin disimpan di sessionStorage, token klien di localStorage/cookie.
   */
  const impersonateUser = useCallback((targetUser: User) => {
    // Simpan token admin di session storage
    const adminToken = localStorage.getItem("auth_token");
    if (adminToken) {
      sessionStorage.setItem("admin_token_backup", adminToken);
    }
    // Simpan info impersonasi
    sessionStorage.setItem("impersonating_user", JSON.stringify(targetUser));
    // Redirect ke dashboard klien
    window.location.href = "/dashboard";
  }, []);

  const exitImpersonation = useCallback(() => {
    const adminToken = sessionStorage.getItem("admin_token_backup");
    if (adminToken) {
      localStorage.setItem("auth_token", adminToken);
    }
    sessionStorage.removeItem("admin_token_backup");
    sessionStorage.removeItem("impersonating_user");
    window.location.href = "/admin";
  }, []);

  const getImpersonatingUser = useCallback((): User | null => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("impersonating_user");
    return stored ? JSON.parse(stored) : null;
  }, []);

  return {
    user: authState.user,
    isAdmin: authState.isAdmin,
    isImpersonating: !!getImpersonatingUser(),
    impersonatedUser: getImpersonatingUser(),
    impersonateUser,
    exitImpersonation,
  };
}
