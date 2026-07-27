import type { FastifyInstance } from "fastify";

import { env } from "../../config/env.js";

import { zodTextFormat } from "openai/helpers/zod";
import { importedResumeSchema } from "./pars.schema.js";
import { createResumeBodySchema } from "../resumes/resume.schema.js";
import { openai } from "../../lib/openAI.js";
import { RESUME_IMPORT_INSTRUCTIONS } from "./helpers/ai-instructions.js";
import { mapImportedResumeToCreateBody } from "./helpers/map-imported-resume.js";

const PDF_MIME_TYPE = "application/pdf";

export default async function openapiTestRoutes(
  app: FastifyInstance,
): Promise<void> {
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
