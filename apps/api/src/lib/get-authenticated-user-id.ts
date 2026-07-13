import type { FastifyRequest } from "fastify";
import { verifyAccessToken } from "./jwt.js";
import { UserRepository } from "../modules/users/user.repository.js";

export type GetAuthenticatedUserIdResult =
  | { userId: string; error: null }
  | {
      userId: null;
      error:
        | "missing_authorization_header"
        | "invalid_authorization_header"
        | "invalid_or_expired_access_token"
        | "user_not_found";
    };

export async function getAuthenticatedUserId({
  request,
  users,
}: {
  request: FastifyRequest;
  users: UserRepository;
}): Promise<GetAuthenticatedUserIdResult> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return {
      userId: null,
      error: "missing_authorization_header",
    };
  }

  if (!authHeader.startsWith("Bearer ")) {
    return {
      userId: null,
      error: "invalid_authorization_header",
    };
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    return {
      userId: null,
      error: "invalid_authorization_header",
    };
  }

  let payload: { sub: string };

  try {
    payload = verifyAccessToken(token);
  } catch {
    return {
      userId: null,
      error: "invalid_or_expired_access_token",
    };
  }

  const user = await users.findById(payload.sub);

  if (!user) {
    return {
      userId: null,
      error: "user_not_found",
    };
  }

  return {
    userId: user.id,
    error: null,
  };
}
