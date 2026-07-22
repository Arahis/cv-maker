import type { FastifyInstance } from "fastify";
import { ResumeService } from "./resume.service.js";
import {
  createResumeBodySchema,
  resumeParamsSchema,
  saveLocalResumeToAccountBodySchema,
  updateResumeBodySchema,
  updateResumeMediaBodySchema,
  updateResumeTemplateBodySchema,
} from "./resume.schema.js";
import z from "zod";

export default async function resumeRoutes(app: FastifyInstance) {
  const resumeService = new ResumeService(app);

  app.get("/", async (request, reply) => {
    return resumeService.list(request, reply);
  });

  app.post("/:id/copy", async (request, reply) => {
    const parsedParams = resumeParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      reply.code(400);
      return {
        error: "Invalid request params",
        issues: parsedParams.error.issues,
      };
    }

    return resumeService.copy(parsedParams.data.id, request, reply);
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

  // Work. here right NOW
  app.post("/save-local-to-account", async (request, reply) => {
    const parsedBody = saveLocalResumeToAccountBodySchema.safeParse(
      request.body,
    );

    if (!parsedBody.success) {
      reply.code(400);
      return {
        error: "Invalid request body",
        issues: parsedBody.error.issues,
      };
    }

    return resumeService.createFromLocal(parsedBody.data, request, reply);
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

  app.patch("/:id/template", async (request, reply) => {
    const parsedParams = resumeParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      reply.code(400);
      return {
        error: "Invalid request params",
        issues: parsedParams.error.issues,
      };
    }

    const parsedBody = updateResumeTemplateBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      reply.code(400);
      return {
        error: "Invalid request body",
        issues: parsedBody.error.issues,
      };
    }

    return resumeService.updateTemplate(
      parsedParams.data.id,
      parsedBody.data,
      request,
      reply,
    );
  });

  app.patch("/:id/media", async (request, reply) => {
    const parsedParams = resumeParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      reply.code(400);
      return {
        error: "Invalid request params",
        issues: parsedParams.error.issues,
      };
    }

    const parsedBody = updateResumeMediaBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      reply.code(400);
      return {
        error: "Invalid request body",
        issues: parsedBody.error.issues,
      };
    }

    return resumeService.updateMedia(
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
