Sebagai seorang *Full-Stack Developer*, ketika kita melihat sebuah PRD Frontend, kita tidak hanya berpikir tentang tampilan visual, melainkan bagaimana status data (*state*), validasi, optimasi performa (seperti meminimalkan re-render), penanganan aset file (keamanan penyimpanan), dan integrasi API berjalan beriringan.

Berikut adalah **Extended & Comprehensive Full-Stack Frontend PRD** untuk **dzayupatner** yang super detail, siap di-*slicing*, lengkap dengan arsitektur folder, tata kelola *state*, validasi skema, dan proteksi logika bisnis di sisi *Client*.

---

# ARCHITECTURAL BLUEPRINT & EXTENDED PRD FRONTEND: dzayupatner

## 1. DETAILED DIRECTORY STRUCTURE & CLEAN ARCHITECTURE

Kita akan menggunakan standar industri modern Next.js 14/15 dengan **App Router**, **TypeScript**, dan pengelompokan berbasis fitur/domain agar kode tetap mudah dikelola saat berkembang.

```text
dzayupatner-frontend/
├── app/
│   ├── layout.tsx                  # Root layout (Provider global: QueryClient, Auth, Toaster)
│   ├── error.tsx                   # Global error boundary template
│   ├── loading.tsx                 # Global top-level loading suspense
│   ├── (public)/                   # UNPROTECTED ROUTES (SEO Friendly - Server Components)
│   │   ├── page.tsx                # Landing Page + State-driven Calculator
│   │   └── verify/[loaId]/         # Public LoA Validator (Bisa diakses umum/dosen)
│   │       └── page.tsx
│   ├── (auth)/                     # AUTHENTICATION ROUTES
│   │   ├── login/
│   │   │   └── page.tsx            # Login form dengan Zod + Hook Form
│   │   └── register/
│   │       └── page.tsx            # Form registrasi (Validasi NIM, No HP)
│   ├── dashboard/                  # CLIENT PROTECTED DASHBOARD (Client-side components)
│   │   ├── layout.tsx              # Sidebar + Header khusus klien
│   │   ├── page.tsx                # Overview orders & info ringkas
│   │   └── orders/[orderId]/
│   │       └── page.tsx            # Detail Order Klien + Stepper + Box QRIS
│   └── admin/                      # ADMIN PROTECTED DASHBOARD (Admin Only RBAC)
│       ├── layout.tsx              # Sidebar + Header khusus admin (Ada info ringkas orderan merah)
│       ├── page.tsx                # Smart Priority Queue (Traffic Light System)
│       ├── orders/[orderId]/
│       │   └── page.tsx            # Upload Center Anti-Salkir + Internal Notes
│       └── customers/
│           ├── page.tsx            # Datatable Customers (Shadcn + TanStack Table)
│           └── [customerId]/
│               └── page.tsx        # Customer Profiler + Impersonate Action Trigger
├── components/                     # REUSABLE ATOMS & MOLECULES COMPONENT (Shadcn UI)
│   ├── ui/                         # Komponen murni dari Shadcn (Button, Card, Dialog, dll)
│   ├── shared/                     # Komponen global buatan sendiri
│   │   ├── whatsapp-cta.tsx        # Dynamic WhatsApp Deep Link Button
│   │   └── file-preview.tsx        # Client-side PDF/Image live viewer
│   └── layouts/
│       ├── admin-sidebar.tsx
│       └── client-sidebar.tsx
├── hooks/                          # CUSTOM REACT HOOKS (Data Fetching & State)
│   ├── use-auth.ts                 # Enkapsulasi manajemen session & impersonasi
│   └── use-order-calculator.ts     # Pemisahan logika hitung tarif dari UI landing page
├── lib/                            # UTILITIES & CONFIGURATIONS
│   ├── utils.ts                    # Bawaan shadcn (clsx + tailwind-merge)
│   └── prisma-types-mock.ts        # Kontrak tipe data dari backend untuk type-safety frontend
├── schemas/                        # VALIDATION SCHEMAS (Zod Engine)
│   ├── auth-schema.ts
│   └── order-schema.ts
└── store/                          # GLOBAL STATE (Zustand) - Jika diperlukan session caching
    └── auth-store.ts

```

---

## 2. DETAIL SPESIFIKASI KOMPONEN & LOGIKA (CLIENT-SIDE CLIENT INTERFACE)

### A. Landing Page & Kalkulator Interaktif (`app/(public)/page.tsx`)

Halaman ini harus berjalan secepat mungkin (*Server Component* untuk kerangka, *Client Component* untuk kalkulator).

* **Logic Rule - Kalkulator Tarif:**
* Tarif Dasar (*Hardcoded Konstanta di Frontend untuk sinkronisasi awal*):
* Turnitin: Rp10.000 / file
* Parafrase: Rp7.000 / per 1% penurunan
* Makalah: Rp8.000 / halaman
* PPT: Rp5.000 / slide
* Sinta 4: LOA Only = Rp300.000 | LOA + Publikasi = Rp680.000
* Sinta 5: LOA Only = Rp280.000 | LOA + Publikasi = Rp550.000
* Sinta 6: LOA Only = Rp250.000 | LOA + Publikasi = Rp400.000
* Non-Sinta: LOA + Publikasi = Rp250.000


* **State Management (Zustand atau React `useState`):**
* `serviceType`: `TURNITIN | PARAFRASE | MAKALAH | PPT | SINTA_4 | SINTA_5 | SINTA_6 | NON_SINTA`
* `quantity` (Halaman/Slide/File): `number` (min: 1)
* `parafraseDelta` (% awal dikurang % target): `number` (min: 1)
* `packageVariant`: `LOA_ONLY | FULL_PUB`


* **Logika Perhitungan Otomatis (`useMemo` untuk mencegah re-render berat):**
```typescript
const totalPrice = useMemo(() => {
  switch(serviceType) {
    case 'MAKALAH': return quantity * 8000;
    case 'PPT': return quantity * 5000;
    case 'TURNITIN': return quantity * 10000;
    case 'PARAFRASE': return parafraseDelta * 7000;
    case 'SINTA_5': return packageVariant === 'LOA_ONLY' ? 280000 : 550000;
    // dst...
    default: return 0;
  }
}, [serviceType, quantity, parafraseDelta, packageVariant]);

```





```
*   **Komponen Penyelamat Klien (CTA WA Nego):**
    *   Jika `totalPrice > 250000`, tampilkan sub-text card: *"Pesan bareng bestie? Dapatkan potongan harga grup!"*
    *   Link WhatsApp otomatis: `getWALink("628123456789", `Halo Admin dzayupatner, saya menghitung estimasi untuk ${serviceType} dengan total Rp${totalPrice.toLocaleString('id-ID')}. Apakah ada harga spesial promo bareng bestie?`)`

### B. Form Registrasi & Validasi Zod (`app/(auth)/register/page.tsx`)
Mencegah data sampah masuk ke sistem temen kamu, sehingga dia tidak pusing membenahi data klien.
*   **Skema Validasi (Zod):**
    ```typescript
    export const RegisterSchema = z.object({
      name: z.string().min(3, "Nama minimal 3 karakter untuk kebutuhan sertifikat/LoA"),
      email: z.string().email("Format email akademik tidak valid"),
      password: z.string().min(6, "Password minimal 6 karakter demi keamanan"),
      university: z.string().min(2, "Mohon masukkan nama Universitas/Kampus Anda resmi"),
      nim: z.string().min(5, "NIM wajib diisi dengan benar"),
      phone: z.string().regex(/^08[1-9][0-9]{7,11}$/, "Nomor WhatsApp harus berformat Indonesia (08xxxxxxxxxx)"),
    });

```

### C. Client Dashboard: Order Detail (`app/dashboard/orders/[orderId]/page.tsx`)

Pusat transparansi agar mahasiswa tidak meneror WhatsApp temanmu.

* **Visual Linear Stepper Component:**
Menggunakan komponen berbasis state API status order (`OrderStatus`):
1. `PREPARATION` $\rightarrow$ Tampilkan komponen download template & upload draf.
2. `REVIEW_QC` $\rightarrow$ Tampilkan indikator proses Turnitin/Parafrase sedang berjalan.
3. `SUBMITTED` $\rightarrow$ Munculkan card khusus untuk download **Bukti Submit OJS (PDF/Image)**.
4. `WAITING_PAYMENT` $\rightarrow$ Aktifkan **Secure Payment Gate (QRIS Box)**.
5. `PAID / PUBLISHED` $\rightarrow$ Buka gembok tombol unduh LoA.


* **Gated Component Logic (LoA Locker):**
```tsx

```



<Button
disabled={!order.isPaid}
variant={order.isPaid ? "default" : "secondary"}
className="w-full flex items-center justify-center gap-2"

{order.isPaid ?  : }
{order.isPaid ? "Unduh Dokumen LoA Resmi" : "LoA Terkunci - Selesaikan Pelunasan"}


```

---

## 3. DETAIL SPESIFIKASI KOMPONEN & LOGIKA (CLIENT-SIDE ADMIN INTERFACE)

### A. Admin Dashboard: Smart Priority Queue (`app/admin/page.tsx`)
Fitur utama yang bertindak sebagai "Otak Kedua" temanmu agar dia tahu apa yang harus dikerjakan saat dia sibuk kuliah.

*   **Algoritma Urgensi Visual (Traffic Light Sorting):**
    Frontend menerima data array object orders dari backend. Kita lakukan *sorting* dan *styling* dinamis di baris tabel (*Row Styling*):
    ```typescript
    const getPriorityColor = (createdAt: string, serviceType: string) => {
      const hoursElapsed = (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
      
      // Kasus Jurnal Sinta 5 (Target 10 Hari Kerja, Hari ke-7 harus sudah beres)
      if (serviceType === 'SINTA_5' && hoursElapsed >= 168) return 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950';
      
      // Kasus Tugas Biasa (Makalah/PPT) jika sudah lewat 24 jam belum disentuh
      if (['MAKALAH', 'PPT'].includes(serviceType) && hoursElapsed >= 24) return 'bg-red-50 text-red-700 border-red-300';
      
      if (hoursElapsed >= 12) return 'bg-yellow-50 text-yellow-700 border-yellow-300';
      return 'bg-green-50 text-green-700 border-green-300';
    };

```

### B. Admin Order Center: Upload Center Anti-Salkir (`app/admin/orders/[orderId]/page.tsx`)

Fitur proteksi ganda agar temanmu **NOL RISIKO SALKIR** file antar mahasiswa.

* **Logika Deteksi Nama File (Anti-Salkir Engine):**
Saat admin memilih file via `<input type="file" />`, jalankan fungsi regex pencocokan string sebelum file terunggah ke server:
```typescript
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, customerName: string) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Ambil kata pertama dari nama customer (lowercase)
  const clientKeyword = customerName.split(" ")[0].toLowerCase();
  const fileNameLower = file.name.toLowerCase();

  // Cek apakah kata kunci nama customer ada di dalam nama file
  if (!fileNameLower.includes(clientKeyword)) {
    // Memicu Modal Dialog Konfirmasi Peringatan Keras dari Shadcn UI
    triggerWarningDialog({
      title: "Deteksi Ketidakcocokan File!",
      description: `Anda sedang mengunggah file "${file.name}" untuk customer bernama "${customerName}". Nama file tidak mengandung kata "${clientKeyword}". Apakah Anda yakin file ini tidak tertukar?`
    });
  }
};

```



```
*   **Live Sandbox Preview Komponen:**
    Gunakan library `<iframe />` bawaan browser atau object URL state untuk membaca dokumen secara lokal sebelum dikirim ke server. Jadi admin bisa melihat isi file tersebut dalam hitungan 1 detik untuk memastikan dokumen itu benar milik mahasiswa yang bersangkutan.

### C. Customer Management: Impersonation Engine (`app/admin/customers/page.tsx`)
Memberikan kontrol penuh kepada admin tanpa perlu meminta password mahasiswa jika mereka kebingungan menggunakan web.
*   **Tombol Aksi UI:** `[Login Sebagai User]`
*   **Cara Kerja Frontend:** Saat diklik, frontend memicu fungsi API untuk mendapatkan *temporary token session*. Token utama admin disimpan sementara di *session storage*, dan token klien dimasukkan ke dalam *cookie/local storage* utama. Frontend melakukan *hard redirect* ke `/dashboard`.
*   **Banner Indikator:** Di bagian atas website klien, tampilkan banner berwarna oranye mencolok: **"Mode Impersonasi: Anda sedang melihat dashboard atas nama [Nama Klien]. [Keluar dari Mode Impersonasi]"** agar temanmu bisa kembali ke akun adminnya dengan sekali klik.

---

## 4. INTEGRASI FORMULA WHATSAPP DEEP LINK & STRATEGI "JARING PENYELAMAT"

Untuk mengantisipasi klien yang merasa kemahalan atau kebingungan tanpa menguras waktu temanmu untuk melakukan *save* nomor, buat komponen utilitas `WhatsAppCTA` global:

```tsx
// components/shared/whatsapp-cta.tsx
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { getWALink } from "@/lib/utils";

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

```

---

## 5. ATURAN PENANGANAN ERROR & STATE INTERAKTIF (PERFORMA & KEAMANAN)

1. **Strict File Constraints Layout:**
Setiap komponen input file di dalam dashboard dilarang keras menerima file mentah tanpa filter ekseptional. Input wajib ditulis seperti ini:
```tsx
<input 
  type="file" 
  accept=".doc,.docx,.pdf" 
  onChange={(e) => validateAndHandleFile(e)} 
  className="hidden" 
  id="file-uploader"
/>

```



```
2.  **Double Click Protection (Debounce Submit):**
    Saat tombol `[Kirim Bukti Pembayaran]` atau `[Kirim Resmi ke Klien]` ditekan, pasang state `isLoading` pada properti tombol Shadcn UI untuk menonaktifkan klik berulang kali:
    ```tsx
    <Button disabled={form.formState.isSubmitting} type="submit">
      {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Kirim Bukti Pembayaran
    </Button>

```

Dengan dokumen spesifikasi teknis frontend sekonkrit ini, proses pembuatan kode program (*slicing*) struktur komponen di Next.js akan berjalan sangat cepat, terstruktur, bebas dari kekacauan kode, dan siap diintegrasikan dengan arsitektur backend kapan saja!