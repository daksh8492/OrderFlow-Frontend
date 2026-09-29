import z from "zod";
import { DISCOUNT_TYPE, ORDER_PRIORITY, ORDER_STATUS, PAYMENT_STATUS } from "../types/order";

export const orderItemSchema = z.object({
  orderItemId: z.string().uuid().optional(),

  serialId: z.number().optional(),

  variantId: z.string().uuid({ error: "Variant is required." }),
  name: z.string().optional(),
  sku: z.string().optional(),

  rate: z.coerce
    .number({
      error: "Rate is required.",
    })
    .min(0),

  quantity: z.coerce
    .number({
      error: "Quantity is required.",
    })
    .positive(),

  taxRate: z.coerce.number().min(0),

  taxAmount: z.coerce.number().min(0),

  discountType: z.enum(DISCOUNT_TYPE),

  discountValue: z.coerce.number().min(0),

  discountAmount: z.coerce.number().min(0),

  itemTotal: z.coerce.number().min(0),

  orderId: z.string().uuid().optional(),
});

export const orderSchema = z.object({
  orderId: z.string().uuid().optional(),

  orderNumber: z.string().optional(),

  customerId: z.string().uuid({ error: "Customer is required." }),

  receiverName: z.string().trim().min(1, "Receiver name is required."),

  receiverPhone: z.string().trim().min(1, "Receiver phone is required."),

  receiverAddress: z.string().trim().min(1, "Receiver address is required."),

  status: z.enum(ORDER_STATUS).default("PENDING"),

  priority: z.enum(ORDER_PRIORITY),

  paymentStatus: z.enum(PAYMENT_STATUS).default("PENDING"),

  orderDate: z.string().optional(),

  items: z.array(orderItemSchema).min(1, "At least one item is required."),

  subtotal: z.coerce.number().min(0),

  totalDiscount: z.coerce.number().min(0),

  totalTax: z.coerce.number().min(0),

  totalAmount: z.coerce.number().min(0),

  fulfillingWarehouseId: z.string().uuid().nullable().optional(),

  createdBy: z.string().uuid().optional(),

  createdAt: z.string().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;
export type OrderItemFormData = z.infer<typeof orderItemSchema>;
