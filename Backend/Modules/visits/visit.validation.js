import { z } from "zod";

export const createVisitSchema = z.object({
  pet: z.string().min(1, "Pet ID is required"),
  owner: z.string().min(1, "Owner ID is required"),
  reason: z.string().trim().optional(),
});

export const updateVisitStatusSchema = z.object({
  status: z.enum(["waiting", "in-progress", "done", "cancelled"]),
  vet: z.string().optional(),
  notes: z.string().trim().optional(),
});
