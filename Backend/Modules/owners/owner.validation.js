import { z } from "zod";

export const createOwnerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  phone: z.string().min(8, "Phone number must be at least 8 digits").trim(),
  email: z.string().email("Invalid email").toLowerCase().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postcode: z.string().optional(),
    })
    .optional(),
});

export const updateOwnerSchema = createOwnerSchema.partial();
