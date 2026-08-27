import OpenAI from "openai";

import { env } from "../config/env.js";

export const openai = new OpenAI({
  apiKey: env.openAiApiKey,
  timeout: 60_000,
  maxRetries: 1,
});
