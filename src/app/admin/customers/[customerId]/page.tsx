"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCog, ArrowLeft, Mail, Phone, GraduationCap, Hash } from "lucide-react";
import Link from "next/link";

// Mock data
const MOCK_CUSTOMER = {
  id: "C1", name: "Andi Wijaya", email: "andi@mail.com",
  university: "Universitas Indonesia", nim: "21051001", phone: "081234567890",
  role: "CLIENT" as const, createdAt: "2026-01-10",
};
const MOCK_ORDERS = [
  { id: "ORD-001", serviceType: "SINTA_5", status: "REVIEW_QC", totalPrice: 550000, isPaid: false },
  { id: "ORD-004", serviceType: "TURNITIN", status: "PAID", totalPrice: 30000, isPaid: true },
];

export default function CustomerProfilePage({ params }: { params: { customerId: string } }) {
  const customer = MOCK_CUSTOMER;

  const handleImpersonate = () => {
    sessionStorage.setItem("admin_token_backup", "mock_admin_token");
    sessionStorage.setItem("impersonating_user", JSON.stringify(customer));
    window.location.href = "/dashboard";
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers">
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white">Profil Klien</h1>
      </div>

      {/* Profile Card */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shrink-0">
              {customer.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-white">{customer.name}</h2>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{customer.role}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="h-3.5 w-3.5" /> {customer.email}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="h-3.5 w-3.5" /> {customer.phone}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <GraduationCap className="h-3.5 w-3.5" /> {customer.university}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Hash className="h-3.5 w-3.5" /> NIM: {customer.nim}
                </div>
              </div>
            </div>
            <Button
              onClick={handleImpersonate}
              className="bg-orange-600 hover:bg-orange-500 text-white flex items-center gap-2"
            >
              <UserCog className="h-4 w-4" />
              Login Sebagai User
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customer Orders */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Riwayat Order</h2>
        <div className="space-y-2">
          {MOCK_ORDERS.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`}>
              <Card className="bg-slate-900 border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">#{order.id}</p>
                    <p className="text-slate-400 text-sm">{order.serviceType} · {order.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">Rp {order.totalPrice.toLocaleString("id-ID")}</p>
                    <Badge className={order.isPaid ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>
                      {order.isPaid ? "Lunas" : "Belum Bayar"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
