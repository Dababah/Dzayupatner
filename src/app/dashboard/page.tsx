import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Mock data – akan diganti dengan data dari API
const MOCK_ORDERS = [
  { id: "ORD-001", serviceType: "SINTA_5", status: "REVIEW_QC", totalPrice: 550000, createdAt: "2026-06-10T10:00:00Z" },
  { id: "ORD-002", serviceType: "MAKALAH", status: "WAITING_PAYMENT", totalPrice: 80000, createdAt: "2026-06-12T14:00:00Z" },
  { id: "ORD-003", serviceType: "TURNITIN", status: "PAID", totalPrice: 30000, createdAt: "2026-06-13T09:00:00Z" },
];

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PREPARATION: { label: "Persiapan", variant: "secondary" },
  REVIEW_QC: { label: "Review QC", variant: "default" },
  SUBMITTED: { label: "Submitted", variant: "default" },
  WAITING_PAYMENT: { label: "Menunggu Bayar", variant: "destructive" },
  PAID: { label: "Lunas", variant: "default" },
  PUBLISHED: { label: "Published", variant: "default" },
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Selamat datang! 👋</h1>
        <p className="text-slate-400 mt-1">Pantau semua order layanan akademik Anda di sini.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-500">Total Order</CardDescription>
            <CardTitle className="text-3xl font-bold text-white">{MOCK_ORDERS.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-500">Menunggu Pembayaran</CardDescription>
            <CardTitle className="text-3xl font-bold text-red-400">
              {MOCK_ORDERS.filter(o => o.status === "WAITING_PAYMENT").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-500">Selesai</CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-400">
              {MOCK_ORDERS.filter(o => ["PAID","PUBLISHED"].includes(o.status)).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Orders List */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Order Terbaru</h2>
        <div className="space-y-3">
          {MOCK_ORDERS.map((order) => (
            <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
              <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                      #{order.id}
                    </p>
                    <p className="text-slate-400 text-sm">{order.serviceType}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={STATUS_LABELS[order.status]?.variant ?? "default"} className="mb-1">
                      {STATUS_LABELS[order.status]?.label ?? order.status}
                    </Badge>
                    <p className="text-slate-300 text-sm font-medium">
                      Rp {order.totalPrice.toLocaleString("id-ID")}
                    </p>
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
