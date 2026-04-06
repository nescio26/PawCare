import z from "zod";

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name Must Be At Least 2 Characters")
    .trim()
    .optional(),
  role: z.enum(["admin", "vet", "staff"]).optional(),
  isActive: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
  password: z.string().min(6, "Password Must Be At Least 6 Characters"),
});
