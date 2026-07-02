import z from "zod";

export const customerSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(3, "Customer Name must be at least 3 characters")
    .max(100, "Customer Name cannot exceed 100 characters"),
  address: z
    .string()
    .trim()
    .min(3, "Address must be at least 3 characters")
    .max(200, "Address cannot exceed 200 characters")
    .optional(),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City cannot exceed 50 characters")
    .optional(),
  contactNumber: z
    .string()
    .regex(/^\d{10}$/, "Invalid contact number format")
    .optional(),
  contactEmail: z.email("Invalid email format").optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;