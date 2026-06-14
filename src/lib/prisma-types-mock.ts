// src/lib/prisma-types-mock.ts
// Kontrak tipe data dari backend untuk type-safety frontend
// Update ini sesuai dengan schema Prisma backend

export type OrderStatus =
  | "PREPARATION"
  | "REVIEW_QC"
  | "SUBMITTED"
  | "WAITING_PAYMENT"
  | "PAID"
  | "PUBLISHED";

export type ServiceType =
  | "TURNITIN"
  | "PARAFRASE"
  | "MAKALAH"
  | "PPT"
  | "SINTA_4"
  | "SINTA_5"
  | "SINTA_6"
  | "NON_SINTA";

export type PackageVariant = "LOA_ONLY" | "FULL_PUB";

export type UserRole = "CLIENT" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  nim: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface Order {
  id: string;
  serviceType: ServiceType;
  packageVariant?: PackageVariant;
  quantity?: number;
  parafraseDelta?: number;
  totalPrice: number;
  status: OrderStatus;
  isPaid: boolean;
  notes?: string;
  internalNotes?: string;
  loaFileUrl?: string;
  submissionProofUrl?: string;
  draftFileUrl?: string;
  createdAt: string;
  updatedAt: string;
  customer: User;
}
