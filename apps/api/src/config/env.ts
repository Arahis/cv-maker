import "dotenv/config";
import type { StringValue } from "ms";

const requiredEnv = [
  "CORS_ORIGINS",
  "DATABASE_URL",
  "PORT",
  "NODE_ENV",
  "COOKIE_SECRET",
  "JWT_ACCESS_SECRET",
  "ACCESS_TOKEN_TTL_MINUTES",
  "REFRESH_COOKIE_NAME",
  "REFRESH_TOKEN_TTL_DAYS",
  "ANONYMOUS_RESUME_FINGERPRINT_SECRET",
  "OPENAI_API_KEY",
  "OPENAI_MODEL",
] as const;

const resumeImportMaxPages = Number(process.env.RESUME_IMPORT_MAX_PAGES ?? 5);

const resumeImportMaxFileSizeMb = Number(
  process.env.RESUME_IMPORT_MAX_FILE_SIZE_MB ?? 10,
);

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} is not set`);
  }
}

export const env = {
  corsOrigins: process.env.CORS_ORIGINS!.split(","),
  databaseUrl: process.env.DATABASE_URL!,
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV!,
  cookieSecret: process.env.COOKIE_SECRET!,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
  accessTokenTtlMinutes:
    `${Number(process.env.ACCESS_TOKEN_TTL_MINUTES ?? 10)}m` as StringValue,
  refreshCookieName: process.env.REFRESH_COOKIE_NAME!,
  refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 30),
  anonymousResumeFingerprintSecret:
    process.env.ANONYMOUS_RESUME_FINGERPRINT_SECRET!,
  isProduction: process.env.NODE_ENV === "production",

  openAiApiKey: process.env.OPENAI_API_KEY!,
  openAiModel: process.env.OPENAI_MODEL!,
  resumeImportMaxPages,
  resumeImportMaxFileSizeBytes: resumeImportMaxFileSizeMb * 1024 * 1024,
};
