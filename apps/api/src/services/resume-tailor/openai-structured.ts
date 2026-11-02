import { zodTextFormat } from "openai/helpers/zod";
import { type ZodType } from "zod";
import { openai } from "../../lib/openAI.js";
import { env } from "../../config/env.js";

export async function parseTailorResponse<T>(
  schema: ZodType<T>,
  formatName: string,
  instructions: string,
  input: unknown,
  model: string,
): Promise<T> {
  const response = await openai.responses.parse({
    model,
    instructions,
    input: JSON.stringify(input),
    text: {
      format: zodTextFormat(schema, formatName),
    },
    max_output_tokens: 6_000,
  });

  if (!response.output_parsed) {
    throw new Error(`The ${formatName} response could not be generated`);
  }

  return response.output_parsed;
}
