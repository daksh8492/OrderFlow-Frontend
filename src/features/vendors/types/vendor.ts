import type { Variant } from "@/features/items/types/item";

export const VENDOR_STATUS = ["ACTIVE", "INACTIVE", "CLOSED"] as const;

export type VendorStatus = (typeof VENDOR_STATUS)[number];

export interface Vendor {
  vendorId: string;
  vendorCode: string;
  vendorName: string;
  address: string;
  TRN: string;
  currency: string;
  city: string;
  vendorBrand: string;
  contactNumber: string;
  contactTelephone: string;
  contactEmail: string;
  paymentTerms: string;
  minimumOrderValue: number;
  status: VendorStatus;
  variantIds: string[];
}

export interface VendorWithVariants extends Vendor {
  variants: Variant[];
}
