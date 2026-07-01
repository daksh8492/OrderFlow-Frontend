export const VARIANT_STATUS = [
  "ACTIVE",
  "INACTIVE",
  "DISCONTINUED",
  "OUT_OF_STOCK",
] as const;

export const ITEM_STATUS = ["DRAFT", "ACTIVE", "INACTIVE", "DISCONTINUED"] as const;

export const ITEM_CATEGORY = [
  "ELECTRONICS",
  "APPARELS",
  "HOME_APPLIANCES",
  "CONSUMER_GOODS",
] as const;

export const INWARD_SOURCE = ["MANUFACTURED", "PURCHASED"] as const;

export type ItemCategory = (typeof ITEM_CATEGORY)[number];

export type ItemStatus = (typeof ITEM_STATUS)[number];

export type InwardSource = (typeof INWARD_SOURCE)[number];

export type VariantStatus = (typeof VARIANT_STATUS)[number];

export interface ItemSummary {
  itemId: string;
  name: string;
  createdAt: string;
  variantCount: number;
  imageUrl: string;
  sourceType: InwardSource;
  category: ItemCategory;
  status: ItemStatus;
}

export interface Item {
  itemId: string;
  name: string;
  createdAt: string;
  variants: Variant[];
  sourceType: InwardSource;
  category: ItemCategory;
  status: ItemStatus;
}

export interface Variant {
  variantId: string;
  name: string;
  sku: string;
  sellingPrice: number;
  purchasePrice: number;
  attributes: {
        key: string;
        value: string;
    }[];
  barcode: string;
  imageUrls: string[] | null;
  itemId: string;
  vendorIds: string[];
  status: VariantStatus;
  createdAt: string;
}
