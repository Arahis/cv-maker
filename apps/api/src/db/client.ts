import { env } from "../config/env.js";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = env.databaseUrl;

const adapter = new PrismaPg({
  connectionString,
});

declare global {
  var __prisma__: PrismaClient | undefined;
}

export const prisma =
  global.__prisma__ ?? new PrismaClient({ adapter, log: ["warn", "error"] });

if (process.env.NODE_ENV !== "production") {
  global.__prisma__ = prisma;
}
