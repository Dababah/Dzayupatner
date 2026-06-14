"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Search, UserCog } from "lucide-react";
import { User } from "@/lib/prisma-types-mock";
import Link from "next/link";

// Mock data – ganti dengan data dari API
const MOCK_CUSTOMERS: User[] = [
  { id: "C1", name: "Andi Wijaya", email: "andi@mail.com", university: "Universitas Indonesia", nim: "21051001", phone: "081234567890", role: "CLIENT", createdAt: "2026-01-10" },
  { id: "C2", name: "Siti Rahayu", email: "siti@mail.com", university: "Universitas Gadjah Mada", nim: "21052002", phone: "082345678901", role: "CLIENT", createdAt: "2026-02-15" },
  { id: "C3", name: "Budi Santoso", email: "budi@mail.com", university: "Institut Teknologi Bandung", nim: "21053003", phone: "083456789012", role: "CLIENT", createdAt: "2026-03-20" },
  { id: "C4", name: "Dewi Kusuma", email: "dewi@mail.com", university: "Universitas Brawijaya", nim: "21054004", phone: "084567890123", role: "CLIENT", createdAt: "2026-04-05" },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [impersonating, setImpersonating] = useState<string | null>(null);

  const filtered = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.university.toLowerCase().includes(search.toLowerCase())
  );

  const handleImpersonate = (customer: User) => {
    // Simpan token admin di sessionStorage
    sessionStorage.setItem("admin_token_backup", "mock_admin_token");
    sessionStorage.setItem("impersonating_user", JSON.stringify(customer));
    setImpersonating(customer.id);
    toast.success(`Mode impersonasi aktif: ${customer.name}`);
    // Redirect ke dashboard klien
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Data Klien</h1>
        <p className="text-slate-400 text-sm mt-1">
          Kelola semua akun klien. Gunakan Impersonasi untuk membantu klien yang kebingungan.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Cari nama, email, atau universitas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500 h-11"
        />
      </div>

      <p className="text-slate-500 text-sm">{filtered.length} klien ditemukan</p>

      {/* Customer Table */}
      <div className="space-y-3">
        {filtered.map((customer) => (
          <Card key={customer.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
            <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{customer.name}</p>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                      {customer.role}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm">{customer.email}</p>
                  <p className="text-slate-500 text-xs">{customer.university} · NIM: {customer.nim}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/customers/${customer.id}`}>
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    Lihat Profil
                  </Button>
                </Link>
                <Button
                  size="sm"
                  onClick={() => handleImpersonate(customer)}
                  disabled={impersonating === customer.id}
                  className="bg-orange-600 hover:bg-orange-500 text-white flex items-center gap-1"
                >
                  <UserCog className="h-3 w-3" />
                  {impersonating === customer.id ? "Masuk..." : "Login Sebagai User"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
