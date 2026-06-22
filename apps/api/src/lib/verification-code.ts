import crypto from "node:crypto";
import { hashToken } from "./tokens.js";

const EMAIL_VERIFICATION_CODE_EXPIRES_IN_MINUTES = 10;

export function generateVerificationCode() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashEmailVerificationCode(userId: string, code: string) {
  return hashToken(`${userId}:${code}`);
}

export function getEmailVerificationCodeExpiresAt() {
  const date = new Date();
  date.setMinutes(
    date.getMinutes() + EMAIL_VERIFICATION_CODE_EXPIRES_IN_MINUTES,
  );
  return date;
}
