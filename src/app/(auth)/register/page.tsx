"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterInput } from "@/schemas/auth-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      // TODO: Sambungkan ke API /api/auth/register
      console.log("Register data:", data);
      toast.success("Akun berhasil dibuat! Silakan login.");
      router.push("/login");
    } catch {
      toast.error("Gagal membuat akun. Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-white">
            dzay<span className="text-blue-400">upatner</span>
          </Link>
          <p className="text-slate-400 mt-1">Buat akun untuk mulai pesan layanan</p>
        </div>

        <Card className="bg-slate-900/80 border-slate-700/50 shadow-2xl shadow-blue-500/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-xl">Daftar Akun</CardTitle>
            <CardDescription className="text-slate-400">
              Isi data dengan benar. Nama Anda akan digunakan di dokumen LoA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="register-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-slate-300">Nama Lengkap</Label>
                <Input
                  id="name"
                  placeholder="Sesuai KTM / Sertifikat"
                  {...register("name")}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11"
                />
                {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-slate-300">Email Aktif</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@kampus.ac.id"
                  {...register("email")}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11"
                />
                {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  {...register("password")}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11"
                />
                {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="university" className="text-slate-300">Universitas / Kampus</Label>
                <Input
                  id="university"
                  placeholder="Universitas Indonesia"
                  {...register("university")}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11"
                />
                {errors.university && <p className="text-red-400 text-xs">{errors.university.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="nim" className="text-slate-300">NIM</Label>
                <Input
                  id="nim"
                  placeholder="2210511001"
                  {...register("nim")}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11"
                />
                {errors.nim && <p className="text-red-400 text-xs">{errors.nim.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone" className="text-slate-300">Nomor WhatsApp</Label>
                <Input
                  id="phone"
                  placeholder="08xxxxxxxxxx"
                  {...register("phone")}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11"
                />
                {errors.phone && <p className="text-red-400 text-xs">{errors.phone.message}</p>}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              form="register-form"
              disabled={isSubmitting}
              className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mendaftarkan...
                </span>
              ) : (
                "Daftar Sekarang"
              )}
            </Button>
            <p className="text-slate-400 text-sm text-center">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Masuk
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
