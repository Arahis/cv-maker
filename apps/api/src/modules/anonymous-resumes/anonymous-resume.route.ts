import type { FastifyInstance } from "fastify";
import { claimAnonymousResumeBodySchema } from "./anonymous-resume.schema.js";
import { AnonymousResumeService } from "./anonymous-resume.service.js";

export default async function anonymousResumeRoutes(app: FastifyInstance) {
  const anonymousResumeService = new AnonymousResumeService(app);

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
}
