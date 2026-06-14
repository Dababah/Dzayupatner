import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter untuk kebutuhan sertifikat/LoA"),
  email: z.string().email("Format email akademik tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter demi keamanan"),
  university: z.string().min(2, "Mohon masukkan nama Universitas/Kampus Anda resmi"),
  nim: z.string().min(5, "NIM wajib diisi dengan benar"),
  phone: z.string().regex(/^08[1-9][0-9]{7,11}$/, "Nomor WhatsApp harus berformat Indonesia (08xxxxxxxxxx)"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
