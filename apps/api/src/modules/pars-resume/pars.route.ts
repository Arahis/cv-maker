import type { FastifyInstance } from "fastify";

import { env } from "../../config/env.js";

import { zodTextFormat } from "openai/helpers/zod";
import { importedResumeSchema } from "./pars.schema.js";
import { createResumeBodySchema } from "../resumes/resume.schema.js";
import { openai } from "../../lib/openAI.js";
import { RESUME_IMPORT_INSTRUCTIONS } from "./helpers/ai-instructions.js";
import { mapImportedResumeToCreateBody } from "./helpers/map-imported-resume.js";
import { getAuthenticatedUserId } from "../../lib/get-authenticated-user-id.js";
import { UserRepository } from "../users/user.repository.js";

const PDF_MIME_TYPE = "application/pdf";
const ACCOUNT_PDF_PARSE_LIMIT = 3;

export default async function parsResumeRoutes(
  app: FastifyInstance,
): Promise<void> {
  const users = new UserRepository(app.prisma);

  app.post("/pars-resume/check", async (request, reply) => {
    const auth = await getAuthenticatedUserId({ request, users });

    if (!auth.userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const canParse = await users.canParsePdf(
      auth.userId,
      ACCOUNT_PDF_PARSE_LIMIT,
    );

    if (!canParse) {
      return reply.code(429).send({
        error: "PDF parsing limit reached",
        message: `Free accounts can parse up to ${ACCOUNT_PDF_PARSE_LIMIT} PDF files.`,
      });
    }

    return { canParse: true };
  });

  app.post("/pars-resume", async (request, reply) => {
    const file = await request.file();

    if (!file) {
      return reply.code(400).send({
        message: "Resume file is required",
      });
    }

    if (file.mimetype !== PDF_MIME_TYPE) {
      return reply.code(415).send({
        message: "Only PDF files are supported",
      });
    }

    if (request.headers.authorization) {
      const auth = await getAuthenticatedUserId({ request, users });

      if (!auth.userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const canParse = await users.pdfParse(
        auth.userId,
        ACCOUNT_PDF_PARSE_LIMIT,
      );

      if (!canParse) {
        return reply.code(429).send({
          error: "PDF parsing limit reached",
          message: `Free accounts can parse up to ${ACCOUNT_PDF_PARSE_LIMIT} PDF files.`,
        });
      }
    }

    const buffer = await file.toBuffer();
    const filename = file.filename || "resume.pdf";

    const response = await openai.responses.parse({
      model: env.openAiModel,

      instructions: RESUME_IMPORT_INSTRUCTIONS,

      input: [
        {
          role: "user",
          content: [
            {
              type: "input_file",
              filename,
              file_data: `data:${file.mimetype};base64,${buffer.toString(
                "base64",
              )}`,
            },
            {
              type: "input_text",
              text: "Extract this resume into the provided schema.",
            },
          ],
        },
      ],

      text: {
        format: zodTextFormat(importedResumeSchema, "imported_resume"),
      },

      max_output_tokens: 6_000,
    });

    const importedResume = response.output_parsed;

    if (!importedResume) {
      return reply.code(502).send({
        message: "The resume could not be parsed",
      });
    }
    const resume = createResumeBodySchema.parse(
      mapImportedResumeToCreateBody(importedResume),
    );

    return reply.send({
      resume,
      usage: response.usage,
    });
  });
}
