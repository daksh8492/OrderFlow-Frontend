import type { ItemStatus } from "../types/item";

export const itemStatusVariant: Record<
  ItemStatus,
  "primary" | "warning" | "error" | "info" | "neutral"
> = {
  DRAFT: "warning",
  ACTIVE: "primary",
  INACTIVE: "neutral",
  DISCONTINUED: "error",
};