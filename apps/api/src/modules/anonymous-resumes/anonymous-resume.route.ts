import type { FastifyInstance } from "fastify";
import {
  checkAnonymousResumeQuotaBodySchema,
  claimAnonymousResumeBodySchema,
  releaseAnonymousResumeBodySchema,
} from "./anonymous-resume.schema.js";
import { AnonymousResumeService } from "./anonymous-resume.service.js";

export default async function anonymousResumeRoutes(app: FastifyInstance) {
  const anonymousResumeService = new AnonymousResumeService(app);

  app.post("/check", async (request, reply) => {
    const parsedBody = checkAnonymousResumeQuotaBodySchema.safeParse(
      request.body,
    );

    if (!parsedBody.success) {
      reply.code(400);
      return {
        error: "Invalid request body",
        issues: parsedBody.error.issues,
      };
    }

    return anonymousResumeService.check(parsedBody.data, request, reply);
  });

  app.post("/claim", async (request, reply) => {
    const parsedBody = claimAnonymousResumeBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      reply.code(400);
      return {
        error: "Invalid request body",
        issues: parsedBody.error.issues,
      };
    }

    return anonymousResumeService.claim(parsedBody.data, request, reply);
  });

  app.post("/release", async (request, reply) => {
    const parsedBody = releaseAnonymousResumeBodySchema.safeParse(
      request.body,
    );

    if (!parsedBody.success) {
      reply.code(400);
      return {
        error: "Invalid request body",
        issues: parsedBody.error.issues,
      };
    }

    return anonymousResumeService.release(parsedBody.data, request, reply);
  });
}
