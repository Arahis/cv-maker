import { z } from "zod";

const passwordFormatMessage =
  "Password must be at least 8 characters and include an uppercase letter, a number, and a special character.";

export const emailSchema = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  return value.trim().toLowerCase();
}, z.email("Invalid email address"));

export const signupPasswordSchema = z
  .string()
  .max(40, "Password must be at most 40 characters")
  .superRefine((password, ctx) => {
    if (!password) {
      ctx.addIssue({
        code: "custom",
        message: "Password is required",
      });
      return;
    }

    const isValid =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password);

    if (!isValid) {
      ctx.addIssue({
        code: "custom",
        message: passwordFormatMessage,
      });
    }
  });

export const signupBodySchema = z.object({
  email: emailSchema,
  password: signupPasswordSchema,
});

export const loginBodySchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password is not less then 8 characters")
    .max(40, "Password must be at most 40 characters"),
});

export type SignupBody = z.infer<typeof signupBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
