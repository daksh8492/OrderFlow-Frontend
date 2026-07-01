import z from "zod";
import { INWARD_SOURCE, ITEM_CATEGORY } from "../types/item";

export const itemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters"),

  sourceType: z.enum(INWARD_SOURCE, {
    message: "Please select a Inward Source",
  }),

  category: z.enum(ITEM_CATEGORY, {
    message: "Please select a Category",
  }),
});

export type ItemFormData = z.infer<typeof itemSchema>;