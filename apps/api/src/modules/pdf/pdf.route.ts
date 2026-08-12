import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { getAuthenticatedUserId } from "../../lib/get-authenticated-user-id.js";
import { UserRepository } from "../users/user.repository.js";
import { ResumeRepository } from "../resumes/resume.repository.js";
import { createPdf } from "./pdf.service.js";

const createPdfBodySchema = z.object({
  resumeId: z.string().min(1),
  html: z.string().min(1),
  css: z.string().default(""),
  baseUrl: z.string().url().optional(),
  stylesheets: z.array(z.string().url()).default([]),
});

export default async function pdfRoutes(app: FastifyInstance) {
  const users = new UserRepository(app.prisma);
  const resumes = new ResumeRepository(app.prisma);

  app.post("/", async (request, reply) => {
    const auth = await getAuthenticatedUserId({ request, users });

    if (!auth.userId) {
      reply.code(401);
      return { error: "Unauthorized" };
    }

    const parsedBody = createPdfBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      reply.code(400);
      return { error: "Invalid request body", issues: parsedBody.error.issues };
    }

    const resume = await resumes.findUserResumeById(
      auth.userId,
      parsedBody.data.resumeId,
    );

    if (!resume) {
      reply.code(404);
      return { error: "Resume not found" };
    }

    const { html, css, baseUrl, stylesheets } = parsedBody.data;
    const pdf = await createPdf({
      html,
      css,
      stylesheets,
      ...(baseUrl ? { baseUrl } : {}),
    });

    return reply
      .type("application/pdf")
      .header("Content-Disposition", 'attachment; filename="resume.pdf"')
      .header("Cache-Control", "no-store")
      .send(pdf);
  });
}
