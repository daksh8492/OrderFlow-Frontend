import z from "zod";

export const variantSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name can not be empty")
      .max(100, "Name cannot exceed 100 characters"),

    sellingPrice: z
      .number()
      .nonnegative("Selling price cannot be negative"),

    purchasePrice: z
      .number()
      .nonnegative("Purchase price cannot be negative"),

    // attributes: z.record(z.string(), z.string()),

    attributes: z.array(
      z.object({
        key: z.string().min(1),
        value: z.string().min(1),
      }),
    ),

    imageUrls: z.array(z.string().url("Invalid image URL")).optional(),

    vendorIds: z.array(z.string()).optional(),
  })
  .refine((data) => data.sellingPrice >= data.purchasePrice, {
    message: "Selling price should not be less than purchase price",
    path: ["sellingPrice"],
  });

export type VariantFormData = z.infer<typeof variantSchema>;
