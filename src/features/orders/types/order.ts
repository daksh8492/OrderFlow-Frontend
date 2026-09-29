export const ORDER_STATUS = [
  "PENDING",
  "PROCESSING",
  "PICKED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "FAILED",
  "RETURNED",
] as const;

export const ORDER_PRIORITY = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export const PAYMENT_STATUS = [
  "PENDING",
  "PARTIALLY_PAID",
  "PAID",
  "REFUNDED",
] as const;

export const DISCOUNT_TYPE = ["VALUE", "PERCENTAGE"];

export type OrderStatus = (typeof ORDER_STATUS)[number];
export type OrderPriority = (typeof ORDER_PRIORITY)[number];
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export interface Order {
  orderId: string;
  orderNumber: string;

  customerId: string;

  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;

  status: OrderStatus;
  priority: OrderPriority;

  orderDate: string;

  paymentStatus: PaymentStatus;

  items: OrderItem[];

  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;

  fulfillingWarehouseId: string | null;

  createdBy: string;
  createdAt: string;
}

export interface OrderItem {
  orderItemId: string;
  serialId: number;
  variantId: string;

  rate: number;
  quantity: number;

  taxRate: number;
  taxAmount: number;

  discountType: (typeof DISCOUNT_TYPE)[number];
  discountValue: number;
  discountAmount: number;

  itemTotal: number;

  orderId: string;
}

export interface OrderSummary {
  orderId: string;
  orderNumber: string;

  customerId: string;
  receiverName: string;

  status: OrderStatus;
  priority: OrderPriority;

  orderDate: string;

  paymentStatus: PaymentStatus;

  totalAmount: number;
}
