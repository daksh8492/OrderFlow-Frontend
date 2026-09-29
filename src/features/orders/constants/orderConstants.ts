import type { OrderPriority, OrderStatus, PaymentStatus } from "../types/order";

export const orderStatusVariant: Record<
  OrderStatus,
  "primary" | "warning" | "error" | "info" | "neutral"
> = {
  PENDING: "warning",
  PROCESSING: "info",
  PICKED: "info",
  PACKED: "info",
  SHIPPED: "info",
  OUT_FOR_DELIVERY: "info",
  DELIVERED: "primary",
  COMPLETED: "primary",
  CANCELLED: "error",
  FAILED: "error",
  RETURNED: "neutral",
};

export const paymentStatusVariant: Record<
  PaymentStatus,
  "primary" | "warning" | "error" | "info" | "neutral"
> = {
  PENDING: "warning",
  PARTIALLY_PAID: "info",
  PAID: "primary",
  REFUNDED: "neutral",
};

export const priorityVariant: Record<
  OrderPriority,
  "primary" | "warning" | "error" | "info" | "neutral"
> = {
  LOW: "neutral",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "error",
};