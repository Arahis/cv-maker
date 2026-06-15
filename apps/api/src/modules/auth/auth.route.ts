import type { FastifyInstance } from "fastify";
import { loginBodySchema, signupBodySchema } from "./auth.schema.js";
import { AuthService } from "./auth.service.js";
import { EmailVerificationService } from "../email-verification/email-verification.service.js";

export default async function authRoutes(app: FastifyInstance) {
  const authService = new AuthService(app);
  const emailVerificationService = new EmailVerificationService(app);

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

  app.post("/verify-email", async (request, reply) => {
    return emailVerificationService.verifyEmail(request, reply);
  });

  app.get("/email-verification/status", async (request, reply) => {
    return emailVerificationService.getStatus(request, reply);
  });

  app.post("/refresh", async (request, reply) => {
    return authService.refresh(request, reply);
  });

  app.post("/logout", async (request, reply) => {
    return authService.logout(request, reply);
  });

  app.get("/me", async (request, reply) => {
    return authService.me(request, reply);
  });
}
