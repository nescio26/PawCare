import { z } from "zod";

export const createPetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.string(),
  breed: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  weight: z.number().min(0).optional(),
  color: z.string().optional(),
  microchipNo: z.string().optional(),
  photo: z.string().optional(),
  owner: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid owner ID"),
});

export const updatePetSchema = createPetSchema.partial();
