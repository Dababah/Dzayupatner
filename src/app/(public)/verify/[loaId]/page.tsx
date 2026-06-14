import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

// Mock public validator
const MOCK_LOA = {
  loaId: "LOA-2026-001",
  studentName: "Andi Wijaya",
  university: "Universitas Indonesia",
  journalName: "International Journal of Engineering and Information Technology",
  sintaLevel: "Sinta 5",
  issuedAt: "2026-06-01",
  status: "VALID",
};

export const metadata = {
  title: "Verifikasi LoA – dzayupatner",
  description: "Verifikasi keaslian Letter of Acceptance (LoA) dari dzayupatner.",
};

export default function VerifyLoaPage({ params }: { params: { loaId: string } }) {
  // TODO: Fetch dari API berdasarkan params.loaId
  const loa = MOCK_LOA;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <p className="text-slate-400 text-sm">Verifikasi Dokumen</p>
          <h1 className="text-3xl font-bold text-white mt-1">dzay<span className="text-blue-400">upatner</span></h1>
        </div>

        <Card className="bg-slate-900 border-slate-800 shadow-2xl">
          <CardHeader className="text-center border-b border-slate-800 pb-4">
            <div className="flex justify-center mb-3">
              {loa.status === "VALID" ? (
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                  <span className="text-3xl">✗</span>
                </div>
              )}
            </div>
            <CardTitle className="text-white text-xl">
              {loa.status === "VALID" ? "LoA Terverifikasi ✅" : "LoA Tidak Valid ❌"}
            </CardTitle>
            <p className="text-slate-400 text-sm">ID: {params.loaId}</p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {[
              { label: "Nama Mahasiswa", value: loa.studentName },
              { label: "Universitas", value: loa.university },
              { label: "Jurnal", value: loa.journalName },
              { label: "Level Sinta", value: loa.sintaLevel },
              { label: "Tanggal Terbit", value: loa.issuedAt },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4 py-2 border-b border-slate-800/50 last:border-0">
                <span className="text-slate-500 text-sm">{label}</span>
                <span className="text-white text-sm font-medium text-right">{value}</span>
              </div>
            ))}
            <div className="pt-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 w-full justify-center py-2">
                ✅ Dokumen ini sah dan dikeluarkan oleh dzayupatner
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
