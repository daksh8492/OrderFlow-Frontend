import { z } from "zod";
import { FIELD_OF_WORK } from "../types/user";

export const userSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters"),

  fieldOfWork: z.enum(FIELD_OF_WORK, {
    message: "Please select a field of work",
  }),

  warehouseId: z.string().trim().optional(),

  address: z
    .string()
    .trim()
    .max(255, "Address cannot exceed 255 characters")
    .optional(),

  city: z
    .string()
    .trim()
    .max(100, "City cannot exceed 100 characters")
    .optional(),

  contactNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Contact number must be 10 digits")
    .optional()
    .or(z.literal("")),

  contactTelephone: z
    .string()
    .trim()
    .max(20, "Telephone number cannot exceed 20 characters")
    .optional(),

  contactEmail: z
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),

  salary: z
    .number({
      error: "Salary must be a number",
    })
    .min(0, "Salary cannot be negative")
    .optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
