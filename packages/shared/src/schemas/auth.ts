import { z } from "zod";

const passwordFormatMessage =
  "Password must be at least 8 characters and include an uppercase letter, a number, and a special character.";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .pipe(z.email("Invalid email address"));

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

export const forgotPasswordVerifyBodySchema = z.object({
  email: emailSchema,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Code must contain 6 digits"),
});

export const forgotPasswordResetPasswordBodySchema = z
  .object({
    password: signupPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const googleAuthBodySchema = z.object({
  code: z.string().min(1, "Google authorization code is required"),
});

export type SignupBody = z.infer<typeof signupBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
export type GoogleAuthBody = z.infer<typeof googleAuthBodySchema>;
export type ForgotPasswordVerifyBody = z.infer<
  typeof forgotPasswordVerifyBodySchema
>;
export type ForgotPasswordResetPasswordBody = z.infer<
  typeof forgotPasswordResetPasswordBodySchema
>;
