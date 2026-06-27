import z from "zod";

export const warehouseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters"),

  address: z
    .string()
    .trim()
    .max(255, "Address cannot exceed 255 characters")
    .optional(),

  city: z.string().trim().max(100, "City cannot exceed 100 characters"),
});

export type WarehouseFormData = z.infer<typeof warehouseSchema>