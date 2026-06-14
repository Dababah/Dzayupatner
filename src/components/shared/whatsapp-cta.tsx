import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface WhatsAppCTAProps {
  phone: string;
  context: "NEGO" | "BINGUNG" | "KENDALA_BAYAR";
  metaData: {
    serviceType?: string;
    totalPrice?: number;
    orderId?: string;
  };
}

export function WhatsAppCTA({ phone, context, metaData }: WhatsAppCTAProps) {
  let templateText = "";

  switch (context) {
    case "NEGO":
      templateText = `Halo Admin dzayupatner, saya sudah cek harga untuk layanan ${metaData.serviceType} senilai Rp${metaData.totalPrice?.toLocaleString('id-ID')}. Apakah saat ini ada promo potongan harga khusus atau paket hemat bareng bestie?`;
      break;
    case "BINGUNG":
      templateText = `Halo Kak, saya sedang di form order layanan ${metaData.serviceType} tapi sedikit bingung cara isi datanya. Mohon arahannya ya Kak, terima kasih!`;
      break;
    case "KENDALA_BAYAR":
      templateText = `Halo Admin, saya ingin konfirmasi pembayaran manual untuk Order ID: #${metaData.orderId}. QRIS saya bermasalah/saya butuh konfirmasi cepat. Ini bukti transfer saya.`;
      break;
  }

  const getWALink = (phone: string, text: string) => {
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <Button 
      variant="outline" 
      className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
      onClick={() => window.open(getWALink(phone, templateText), "_blank")}
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      {context === "NEGO" ? "Nego Paket / Tanya Promo" : context === "BINGUNG" ? "Butuh Panduan Admin" : "Konfirmasi Manual via WA"}
    </Button>
  );
}
