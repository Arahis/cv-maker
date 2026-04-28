import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type AccessTokenPayload = {
  sub: string;
  email: string;
};

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.accessTokenTtlMinutes,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.jwtAccessSecret);

  if (typeof decoded === "string" || !decoded.sub || !decoded.email) {
    throw new Error("Invalid access token");
  }
  return {
    sub: String(decoded.sub),
    email: String(decoded.email),
  };
}
