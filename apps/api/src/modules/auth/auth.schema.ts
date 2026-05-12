import { z } from "zod";

export const signupBodySchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

export const loginBodySchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(100),
});

export type SignupBody = z.infer<typeof signupBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
