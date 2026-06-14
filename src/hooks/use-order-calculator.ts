"use client";

import { useMemo, useState } from "react";

type ServiceType = "TURNITIN" | "PARAFRASE" | "MAKALAH" | "PPT" | "SINTA_4" | "SINTA_5" | "SINTA_6" | "NON_SINTA";
type PackageVariant = "LOA_ONLY" | "FULL_PUB";

/**
 * useOrderCalculator – Pemisahan logika hitung tarif dari UI landing page
 */
export function useOrderCalculator() {
  const [serviceType, setServiceType] = useState<ServiceType>("TURNITIN");
  const [quantity, setQuantity] = useState<number>(1);
  const [parafraseDelta, setParafraseDelta] = useState<number>(1);
  const [packageVariant, setPackageVariant] = useState<PackageVariant>("LOA_ONLY");

  const totalPrice = useMemo(() => {
    switch (serviceType) {
      case "MAKALAH": return quantity * 8000;
      case "PPT": return quantity * 5000;
      case "TURNITIN": return quantity * 10000;
      case "PARAFRASE": return parafraseDelta * 7000;
      case "SINTA_4": return packageVariant === "LOA_ONLY" ? 300000 : 680000;
      case "SINTA_5": return packageVariant === "LOA_ONLY" ? 280000 : 550000;
      case "SINTA_6": return packageVariant === "LOA_ONLY" ? 250000 : 400000;
      case "NON_SINTA": return 250000;
      default: return 0;
    }
  }, [serviceType, quantity, parafraseDelta, packageVariant]);

  const showGroupPromo = totalPrice > 250000;
  const isJournalService = ["SINTA_4","SINTA_5","SINTA_6","NON_SINTA"].includes(serviceType);
  const isQuantityBased = ["MAKALAH","PPT","TURNITIN"].includes(serviceType);

  return {
    serviceType, setServiceType,
    quantity, setQuantity,
    parafraseDelta, setParafraseDelta,
    packageVariant, setPackageVariant,
    totalPrice,
    showGroupPromo,
    isJournalService,
    isQuantityBased,
  };
}
