import { zodTextFormat } from "openai/helpers/zod";
import { env } from "../../config/env.js";
import { openai } from "../../lib/openAI.js";
import {
  tailorAnalysisSchema,
  type TailorAnalysis,
} from "@cv-maker/shared";
import { RESUME_TAILOR_INSTRUCTIONS } from "./tailor.instructions.js";
import type { PreparedTailorInput } from "./prepare-tailor-input.js";

export class ResumeTailorService {
  async tailorResume({
    resume,
    jobTitle,
    jobDescription,
  }: {
    resume: PreparedTailorInput;
    jobTitle: string;
    jobDescription: string;
  }): Promise<TailorAnalysis> {
    const response = await openai.responses.parse({
      model: "gpt-4o-mini",
      instructions: RESUME_TAILOR_INSTRUCTIONS,
      input: JSON.stringify({
        resume,
        job: {
          title: jobTitle,
          description: jobDescription,
        },
      }),
      text: {
        format: zodTextFormat(tailorAnalysisSchema, "tailor_analysis"),
      },
      max_output_tokens: 6_000,
    });

    if (!response.output_parsed) {
      throw new Error("The resume tailoring analysis could not be generated");
    }

    return response.output_parsed;
  }
}
