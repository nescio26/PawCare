import { z } from "zod";

export const createRecordSchema = z.object({
  visit: z.string().min(1, "Visit ID is required"),
  pet: z.string().min(1, "Pet ID is required"),
  vet: z.string().min(1, "Vet ID is required"),
  symptoms: z.string().trim().optional(),
  diagnosis: z.string().trim().optional(),
  treatment: z.string().trim().optional(),
  prescription: z
    .array(
      z.object({
        medicine: z.string(),
        dosage: z.string(),
        duration: z.string(),
      }),
    )
    .optional(),
  weight: z.number().positive().optional(),
  temperature: z.number().positive().optional(),
  notes: z.string().trim().optional(),
  followUpDate: z.string().optional(),
});

export const updateRecordSchema = createRecordSchema.partial();
