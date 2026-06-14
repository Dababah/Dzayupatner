"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, FileText, Eye, AlertTriangle, Loader2 } from "lucide-react";

// Mock data
const MOCK_ORDER = {
  id: "ORD-001",
  serviceType: "SINTA_5",
  status: "REVIEW_QC",
  totalPrice: 550000,
  internalNotes: "Artikel sudah di-submit ke OJS IJEIT tanggal 10 Juni. Tunggu review editor.",
  customer: { id: "C1", name: "Andi Wijaya", university: "UI", nim: "21051001", email: "andi@mail.com" },
};

export default function AdminOrderDetailPage({ params }: { params: { orderId: string } }) {
  const order = MOCK_ORDER;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"pdf" | "image" | null>(null);
  const [warningDialog, setWarningDialog] = useState<{ open: boolean; filename: string; keyword: string } | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [internalNotes, setInternalNotes] = useState(order.internalNotes ?? "");

  /**
   * Anti-Salkir Engine: Cek nama file vs nama customer sebelum upload
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const clientKeyword = order.customer.name.split(" ")[0].toLowerCase();
    const fileNameLower = file.name.toLowerCase();

    if (!fileNameLower.includes(clientKeyword)) {
      // Simpan file & munculkan dialog peringatan keras
      setPendingFile(file);
      setWarningDialog({ open: true, filename: file.name, keyword: clientKeyword });
    } else {
      // Nama cocok, langsung proses
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (file.type === "application/pdf") setPreviewType("pdf");
    else if (file.type.startsWith("image/")) setPreviewType("image");
    toast.success(`File "${file.name}" berhasil dimuat. Periksa preview sebelum upload.`);
  };

  const confirmUpload = async () => {
    if (!pendingFile) return;
    processFile(pendingFile);
    setWarningDialog(null);
    setPendingFile(null);
  };

  const handleUploadToServer = async () => {
    if (!previewUrl) return;
    setIsUploading(true);
    try {
      await new Promise(r => setTimeout(r, 1500)); // Simulate API call
      toast.success("File berhasil diupload ke server!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Order #{params.orderId} – Upload Center</h1>
          <p className="text-slate-400 text-sm">
            Customer: <span className="text-white font-medium">{order.customer.name}</span> · {order.customer.university} · {order.customer.nim}
          </p>
        </div>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{order.status}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Anti-Salkir Upload */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-orange-400" />
              Anti-Salkir Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-orange-950/30 border border-orange-500/30 rounded-lg p-3 text-sm text-orange-300 flex gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                File akan dicek otomatis apakah mengandung nama customer{" "}
                <strong>&ldquo;{order.customer.name.split(" ")[0]}&rdquo;</strong> untuk mencegah salah kirim.
              </span>
            </div>

            {/* Hidden file input – Strict MIME type */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".doc,.docx,.pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="file-uploader"
            />
            <label
              htmlFor="file-uploader"
              className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-orange-500/50 hover:bg-orange-950/10 transition-all"
            >
              <FileText className="h-8 w-8 text-slate-500 mb-2" />
              <span className="text-slate-400 text-sm">Klik untuk pilih file</span>
              <span className="text-slate-600 text-xs">.doc, .docx, .pdf, .jpg, .png</span>
            </label>

            {previewUrl && (
              <Button
                onClick={handleUploadToServer}
                disabled={isUploading}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengupload...
                  </>
                ) : (
                  "Upload ke Server"
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Live Sandbox Preview */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-400" />
              Live Preview Dokumen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {previewUrl ? (
              previewType === "pdf" ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-64 rounded-lg border border-slate-700"
                  title="Preview PDF"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview dokumen"
                  className="w-full h-64 object-contain rounded-lg border border-slate-700"
                />
              )
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-lg">
                <div className="text-center">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Preview akan muncul di sini setelah file dipilih</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Internal Notes */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Catatan Internal Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            className="w-full h-28 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 resize-none focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
            placeholder="Tulis catatan internal di sini (tidak terlihat oleh klien)..."
          />
          <Button className="mt-2 bg-slate-700 hover:bg-slate-600 text-white">
            Simpan Catatan
          </Button>
        </CardContent>
      </Card>

      {/* Anti-Salkir Warning Dialog */}
      <Dialog open={warningDialog?.open ?? false} onOpenChange={() => setWarningDialog(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Deteksi Ketidakcocokan File!
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Anda sedang mengunggah file{" "}
              <strong className="text-white">&ldquo;{warningDialog?.filename}&rdquo;</strong> untuk customer bernama{" "}
              <strong className="text-white">{order.customer.name}</strong>. Nama file tidak mengandung kata{" "}
              <strong className="text-red-400">&ldquo;{warningDialog?.keyword}&rdquo;</strong>.
              <br /><br />
              Apakah Anda yakin file ini <strong>tidak tertukar</strong> dengan milik klien lain?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" onClick={() => setWarningDialog(null)}>
              Batalkan – Pilih File Lain
            </Button>
            <Button className="bg-red-600 hover:bg-red-500 text-white" onClick={confirmUpload}>
              Ya, Saya Yakin Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
