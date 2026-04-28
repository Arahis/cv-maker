import type { FastifyInstance } from "fastify";
import { ResumeService } from "./resume.service.js";
import {
  createResumeBodySchema,
  resumeParamsSchema,
  updateResumeBodySchema,
} from "./resume.schema.js";

export default async function resumeRoutes(app: FastifyInstance) {
  const resumeService = new ResumeService(app);

  app.get("/", async (request, reply) => {
    return resumeService.list(request, reply);
  });

  app.get("/:id", async (request, reply) => {
    const parsedParams = resumeParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      reply.code(400);
      return {
        error: "Invalid request params",
        issues: parsedParams.error.issues,
      };
    }

    return resumeService.get(parsedParams.data.id, request, reply);
  });

  app.post("/", async (request, reply) => {
    const parsedBody = createResumeBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      reply.code(400);
      return {
        error: "Invalid request body",
        issues: parsedBody.error.issues,
      };
    }

    return resumeService.create(parsedBody.data, request, reply);
  });

  app.patch("/:id", async (request, reply) => {
    const parsedParams = resumeParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      reply.code(400);
      return {
        error: "Invalid request params",
        issues: parsedParams.error.issues,
      };
    }

    const parsedBody = updateResumeBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      reply.code(400);
      return {
        error: "Invalid request body",
        issues: parsedBody.error.issues,
      };
    }

    return resumeService.update(
      parsedParams.data.id,
      parsedBody.data,
      request,
      reply,
    );
  });

  app.delete("/:id", async (request, reply) => {
    const parsedParams = resumeParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      reply.code(400);
      return {
        error: "Invalid request params",
        issues: parsedParams.error.issues,
      };
    }

    return resumeService.delete(parsedParams.data.id, request, reply);
  });
}
