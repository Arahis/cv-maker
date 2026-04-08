import "dotenv/config";

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
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} is not set`);
  }
}

export const env = {
  corsOrigins: process.env.CORS_ORIGINS!.split(","),
  databaseUrl: process.env.DATABASE_URL!,
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV!,
  cookieSecret: process.env.COOKIE_SECRET!,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
  accessTokenTtl: Number(process.env.ACCESS_TOKEN_TTL_MINUTES ?? 15),
  refreshCookieName: process.env.REFRESH_COOKIE_NAME!,
  refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 30),
  isProduction: process.env.NODE_ENV === "production",
};
