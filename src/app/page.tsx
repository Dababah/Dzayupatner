"use client";

import { useOrderCalculator } from "@/hooks/use-order-calculator";
import { WhatsAppCTA } from "@/components/shared/whatsapp-cta";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const SERVICE_LABELS: Record<string, string> = {
  TURNITIN: "Cek Turnitin",
  PARAFRASE: "Parafrase",
  MAKALAH: "Pembuatan Makalah",
  PPT: "Pembuatan PPT",
  SINTA_4: "Jurnal Sinta 4",
  SINTA_5: "Jurnal Sinta 5",
  SINTA_6: "Jurnal Sinta 6",
  NON_SINTA: "Jurnal Non-Sinta",
};

export default function LandingPage() {
  const {
    serviceType, setServiceType,
    quantity, setQuantity,
    parafraseDelta, setParafraseDelta,
    packageVariant, setPackageVariant,
    totalPrice,
    showGroupPromo,
    isJournalService,
    isQuantityBased,
  } = useOrderCalculator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            dzay<span className="text-blue-400">upatner</span>
          </span>
          <div className="flex gap-3">
            <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10">
              Masuk
            </Link>
            <Link href="/register" className="text-sm bg-blue-600 hover:bg-blue-500 transition-colors px-4 py-2 rounded-lg font-medium">
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-12 text-center">
        <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
          ✨ Layanan Akademik Terpercaya
        </Badge>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Selesaikan Tugasmu{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Bersama Kami
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Turnitin, Parafrase, Makalah, PPT, hingga Publikasi Jurnal Sinta. Transparan, cepat, dan terpercaya.
        </p>
      </section>

      {/* Calculator */}
      <section className="max-w-2xl mx-auto px-4 pb-24">
        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm shadow-2xl shadow-blue-500/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              🧮 Kalkulator Tarif
            </CardTitle>
            <CardDescription className="text-slate-400">
              Hitung estimasi harga secara transparan. Tanpa biaya tersembunyi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Service Type */}
            <div className="space-y-2">
              <Label htmlFor="service-type" className="text-slate-300 font-medium">Jenis Layanan</Label>
              <select
                id="service-type"
                className="flex h-11 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white ring-offset-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as Parameters<typeof setServiceType>[0])}
              >
                {Object.entries(SERVICE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            {/* Quantity (for MAKALAH, PPT, TURNITIN) */}
            {isQuantityBased && (
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-slate-300 font-medium">
                  Jumlah {serviceType === "TURNITIN" ? "File" : serviceType === "PPT" ? "Slide" : "Halaman"}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500 h-11"
                />
              </div>
            )}

            {/* Parafrase Delta */}
            {serviceType === "PARAFRASE" && (
              <div className="space-y-2">
                <Label htmlFor="parafrase" className="text-slate-300 font-medium">
                  Target Penurunan Plagiasi (%)
                </Label>
                <Input
                  id="parafrase"
                  type="number"
                  min={1}
                  max={100}
                  value={parafraseDelta}
                  onChange={(e) => setParafraseDelta(Math.max(1, Number(e.target.value)))}
                  className="bg-slate-800 border-slate-700 text-white focus:border-blue-500 h-11"
                />
                <p className="text-xs text-slate-500">Misal: dari 40% → 10% = 30% penurunan</p>
              </div>
            )}

            {/* Package Variant (for Sinta) */}
            {isJournalService && serviceType !== "NON_SINTA" && (
              <div className="space-y-2">
                <Label htmlFor="package" className="text-slate-300 font-medium">Paket Publikasi</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(["LOA_ONLY", "FULL_PUB"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setPackageVariant(v)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        packageVariant === v
                          ? "border-blue-500 bg-blue-500/20 text-blue-300"
                          : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {v === "LOA_ONLY" ? "🎓 Hanya LoA" : "📄 LoA + Publikasi"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Result */}
            <div className="pt-4 border-t border-slate-700/50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-300 font-semibold">Estimasi Total:</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>

              {showGroupPromo && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-sm mb-4 text-center">
                  ✨ Pesan bareng bestie? Dapatkan potongan harga grup!
                </div>
              )}

              <div className="flex flex-col gap-3">
                <WhatsAppCTA
                  phone="628123456789"
                  context="NEGO"
                  metaData={{ serviceType, totalPrice }}
                />
                <Link
                  href="/register"
                  className="flex items-center justify-center w-full h-10 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
                >
                  Daftar & Pesan Sekarang →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
