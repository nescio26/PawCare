import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "vet", "staff"]).default("staff"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});
