import type { FastifyInstance } from "fastify";
import {
  googleAuthBodySchema,
  loginBodySchema,
  signupBodySchema,
} from "./auth.schema.js";
import { AuthService } from "./auth.service.js";
import { GoogleTokenVerificationError } from "./google-token.service.js";
import { EmailVerificationService } from "../email-verification/email-verification.service.js";
import { PasswordResetService } from "../password-reset/password-reset.service.js";

export default async function authRoutes(app: FastifyInstance) {
  const authService = new AuthService(app);
  const emailVerificationService = new EmailVerificationService(app);
  const passwordResetService = new PasswordResetService(app);

  app.post("/signup", async (request, reply) => {
    const parsedBody = signupBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      reply.code(400);
      return {
        error: "Invalid request body",
        issues: parsedBody.error.issues,
      };
    }

    return authService.signup(parsedBody.data, request, reply);
  });

  app.post("/login", async (request, reply) => {
    const parsedBody = loginBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      reply.code(400);
      return {
        error: "Invalid request body",
        issues: parsedBody.error.issues,
      };
    }

    return authService.login(parsedBody.data, request, reply);
  });

  app.post("/google", async (request, reply) => {
    const parsedBody = googleAuthBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.code(400).send({ error: "Invalid Google authorization code" });
    }

    try {
      const result = await authService.googleLogin(parsedBody.data, request, reply);
      return result;
    } catch (error) {
      if (error instanceof GoogleTokenVerificationError) {
        return reply.code(401).send({ error: "Invalid Google authorization code" });
      }

      throw error;
    }
  });

  app.post("/verify-email-code", async (request, reply) => {
    return emailVerificationService.verifyEmailCode(request, reply);
  });

  app.post("/forgot-password", async (request, reply) => {
    return passwordResetService.sendCode(request, reply);
  });

  app.post("/forgot-password/verify", async (request, reply) => {
    return passwordResetService.verifyCode(request, reply);
  });

  app.post("/forgot-password/reset-password", async (request, reply) => {
    return passwordResetService.resetPassword(request, reply);
  });

  app.post("/refresh", async (request, reply) => {
    return authService.refresh(request, reply);
  });

  app.post("/logout", async (request, reply) => {
    return authService.logout(request, reply);
  });

  app.post("/delete-account", async (request, reply) => {
    return authService.deleteAccount(request, reply);
  });

  app.get("/me", async (request, reply) => {
    return authService.me(request, reply);
  });
}
