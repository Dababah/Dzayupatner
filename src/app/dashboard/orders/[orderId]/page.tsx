"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppCTA } from "@/components/shared/whatsapp-cta";
import { Lock, Unlock, Download, CheckCircle2, Circle } from "lucide-react";
import { OrderStatus } from "@/lib/prisma-types-mock";

// Mock data – akan diganti dengan data dari API berdasarkan params.orderId
const MOCK_ORDER = {
  id: "ORD-001",
  serviceType: "SINTA_5",
  packageVariant: "FULL_PUB",
  totalPrice: 550000,
  status: "WAITING_PAYMENT" as OrderStatus,
  isPaid: false,
  loaFileUrl: null,
  submissionProofUrl: "/mock-proof.pdf",
  customer: { name: "Budi Santoso", phone: "6281234567890" },
};

const STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: "PREPARATION", label: "Persiapan", description: "Download template & upload draf awal" },
  { status: "REVIEW_QC", label: "Review & QC", description: "Proses Turnitin / Parafrase sedang berjalan" },
  { status: "SUBMITTED", label: "Submitted", description: "Bukti submit OJS tersedia untuk diunduh" },
  { status: "WAITING_PAYMENT", label: "Menunggu Pembayaran", description: "Selesaikan pelunasan via QRIS" },
  { status: "PAID", label: "Lunas & Selesai", description: "Dokumen LoA resmi dapat diunduh" },
];

const STATUS_ORDER: OrderStatus[] = ["PREPARATION","REVIEW_QC","SUBMITTED","WAITING_PAYMENT","PAID","PUBLISHED"];

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const order = MOCK_ORDER; // TODO: fetch dari API berdasarkan params.orderId
  const currentStepIndex = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Order #{params.orderId}</h1>
          <p className="text-slate-400 text-sm mt-1">
            {order.serviceType} — Rp {order.totalPrice.toLocaleString("id-ID")}
          </p>
        </div>
        <Badge className={order.isPaid ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
          {order.isPaid ? "✅ Lunas" : "⏳ Belum Lunas"}
        </Badge>
      </div>

      {/* Visual Stepper */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Progress Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {STEPS.map((step, i) => {
              const isCompleted = i < currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={step.status} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="h-6 w-6 rounded-full border-2 border-blue-400 bg-blue-400/20 shrink-0 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                      </div>
                    ) : (
                      <Circle className="h-6 w-6 text-slate-600 shrink-0" />
                    )}
                    {i < STEPS.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 ${isCompleted ? "bg-emerald-400/50" : "bg-slate-700"}`} />
                    )}
                  </div>
                  <div className={`pb-4 ${!isCompleted && !isCurrent ? "opacity-40" : ""}`}>
                    <p className={`font-medium text-sm ${isCurrent ? "text-blue-400" : isCompleted ? "text-emerald-400" : "text-slate-300"}`}>
                      {step.label}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">{step.description}</p>

                    {/* Step-specific content */}
                    {isCurrent && step.status === "SUBMITTED" && order.submissionProofUrl && (
                      <a
                        href={order.submissionProofUrl}
                        target="_blank"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 underline"
                      >
                        <Download className="h-3 w-3" /> Unduh Bukti Submit OJS
                      </a>
                    )}

                    {isCurrent && step.status === "WAITING_PAYMENT" && (
                      <div className="mt-3 space-y-2">
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                          <p className="text-slate-400 text-xs mb-2">Scan QRIS untuk pembayaran</p>
                          <div className="h-32 w-32 mx-auto bg-slate-700 rounded-lg flex items-center justify-center">
                            <p className="text-slate-500 text-xs">QRIS di sini</p>
                          </div>
                          <p className="text-white font-bold mt-2">Rp {order.totalPrice.toLocaleString("id-ID")}</p>
                        </div>
                        <WhatsAppCTA
                          phone="628123456789"
                          context="KENDALA_BAYAR"
                          metaData={{ orderId: order.id }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* LoA Locker – Gated Component */}
      <Card className={`border ${order.isPaid ? "bg-emerald-950/30 border-emerald-500/30" : "bg-slate-900 border-slate-800"}`}>
        <CardContent className="p-6">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            {order.isPaid ? <Unlock className="h-4 w-4 text-emerald-400" /> : <Lock className="h-4 w-4 text-slate-500" />}
            Dokumen LoA Resmi
          </h2>
          <Button
            disabled={!order.isPaid}
            variant={order.isPaid ? "default" : "secondary"}
            className={`w-full flex items-center justify-center gap-2 h-11 ${
              order.isPaid
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {order.isPaid ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {order.isPaid ? "Unduh Dokumen LoA Resmi" : "LoA Terkunci – Selesaikan Pelunasan"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
