import { z } from "zod";

export const OrderSchema = z.object({
  serviceType: z.enum(["TURNITIN","PARAFRASE","MAKALAH","PPT","SINTA_4","SINTA_5","SINTA_6","NON_SINTA"]),
  packageVariant: z.enum(["LOA_ONLY","FULL_PUB"]).optional(),
  quantity: z.number().min(1).optional(),
  parafraseDelta: z.number().min(1).optional(),
  notes: z.string().optional(),
});

export type OrderInput = z.infer<typeof OrderSchema>;

export const PaymentProofSchema = z.object({
  orderId: z.string().min(1, "Order ID tidak boleh kosong"),
  proofFile: z.instanceof(File, { message: "File bukti pembayaran wajib diupload" }),
});

export type PaymentProofInput = z.infer<typeof PaymentProofSchema>;
