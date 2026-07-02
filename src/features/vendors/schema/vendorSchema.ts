import { z } from "zod";

export const vendorSchema = z.object({
  vendorName: z
    .string()
    .trim()
    .min(3, "Vendor name must be at least 3 characters")
    .max(100, "Vendor name cannot exceed 100 characters"),

  vendorBrand: z
    .string()
    .trim()
    .max(100, "Brand cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(255, "Address cannot exceed 255 characters"),

  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(100, "City cannot exceed 100 characters"),

  contactEmail: z.string().trim().email("Enter a valid email address"),

  contactNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10,15}$/, "Enter a valid contact number"),

  contactTelephone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{6,20}$/, "Enter a valid telephone number")
    .optional()
    .or(z.literal("")),

  TRN: z
    .string()
    .trim()
    .max(50, "TRN cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),

  currency: z
    .string()
    .trim()
    .min(1, "Currency is required")
    .max(10, "Currency cannot exceed 10 characters"),

  paymentTerms: z
    .string()
    .trim()
    .min(1, "Payment terms are required")
    .max(100, "Payment terms cannot exceed 100 characters"),

  minimumOrderValue: z.coerce
    .number()
    .min(0, "Minimum order value cannot be negative")
    .optional(),
});

export type VendorFormData = z.infer<typeof vendorSchema>;
