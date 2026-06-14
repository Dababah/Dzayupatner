"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Order, ServiceType } from "@/lib/prisma-types-mock";

// Mock data – diganti dengan data dari API
const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001", serviceType: "SINTA_5", totalPrice: 550000, status: "REVIEW_QC",
    isPaid: false, createdAt: new Date(Date.now() - 180 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(), packageVariant: "FULL_PUB",
    customer: { id: "C1", name: "Andi Wijaya", email: "andi@mail.com", university: "UI", nim: "21051001", phone: "081234", role: "CLIENT", createdAt: "" },
  },
  {
    id: "ORD-002", serviceType: "MAKALAH", totalPrice: 80000, status: "PREPARATION",
    isPaid: false, createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(), quantity: 10,
    customer: { id: "C2", name: "Siti Rahayu", email: "siti@mail.com", university: "UGM", nim: "21052002", phone: "082345", role: "CLIENT", createdAt: "" },
  },
  {
    id: "ORD-003", serviceType: "PPT", totalPrice: 25000, status: "PREPARATION",
    isPaid: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(), quantity: 5,
    customer: { id: "C3", name: "Budi Santoso", email: "budi@mail.com", university: "ITB", nim: "21053003", phone: "083456", role: "CLIENT", createdAt: "" },
  },
];

/**
 * Algoritma Urgensi Visual (Traffic Light Sorting)
 */
function getPriorityColor(createdAt: string, serviceType: ServiceType): string {
  const hoursElapsed = (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);

  if (serviceType === "SINTA_5" && hoursElapsed >= 168)
    return "border-red-500/50 bg-red-950/30";
  if (["MAKALAH","PPT"].includes(serviceType) && hoursElapsed >= 24)
    return "border-red-500/50 bg-red-950/30";
  if (hoursElapsed >= 12)
    return "border-yellow-500/50 bg-yellow-950/30";
  return "border-emerald-500/50 bg-emerald-950/30";
}

function getPriorityBadge(createdAt: string, serviceType: ServiceType) {
  const hoursElapsed = (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  const h = Math.round(hoursElapsed);

  if ((serviceType === "SINTA_5" && hoursElapsed >= 168) || (["MAKALAH","PPT"].includes(serviceType) && hoursElapsed >= 24)) {
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">🔴 URGEN – {h}j lalu</Badge>;
  }
  if (hoursElapsed >= 12) {
    return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">🟡 PANTAU – {h}j lalu</Badge>;
  }
  return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">🟢 AMAN – {h}j lalu</Badge>;
}

// Sort by urgency (most urgent first)
function sortByUrgency(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => {
    const aHours = (new Date().getTime() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60);
    const bHours = (new Date().getTime() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60);
    return bHours - aHours;
  });
}

const STATUS_LABELS: Record<string, string> = {
  PREPARATION: "Persiapan", REVIEW_QC: "Review QC", SUBMITTED: "Submitted",
  WAITING_PAYMENT: "Tunggu Bayar", PAID: "Lunas", PUBLISHED: "Published",
};

export default function AdminDashboardPage() {
  const sortedOrders = sortByUrgency(MOCK_ORDERS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Smart Priority Queue 🧠</h1>
        <p className="text-slate-400 text-sm mt-1">
          Order diurutkan otomatis berdasarkan urgensi. Merah = harus segera dikerjakan!
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="h-3 w-3 rounded-full bg-red-500" /> Urgen
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="h-3 w-3 rounded-full bg-yellow-500" /> Perlu Dipantau
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="h-3 w-3 rounded-full bg-emerald-500" /> Aman
        </div>
      </div>

      <div className="space-y-3">
        {sortedOrders.map((order) => (
          <Link key={order.id} href={`/admin/orders/${order.id}`}>
            <Card className={`border transition-all hover:opacity-80 cursor-pointer ${getPriorityColor(order.createdAt, order.serviceType)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold">#{order.id}</span>
                      {getPriorityBadge(order.createdAt, order.serviceType)}
                    </div>
                    <p className="text-slate-300 text-sm font-medium">{order.customer.name}</p>
                    <p className="text-slate-500 text-xs">{order.serviceType} • {STATUS_LABELS[order.status]}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">Rp {order.totalPrice.toLocaleString("id-ID")}</p>
                    <p className="text-slate-500 text-xs">{order.customer.university}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
