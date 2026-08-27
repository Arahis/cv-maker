import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import { getAuthenticatedUserId } from "../../lib/get-authenticated-user-id.js";
import { uploadToR2 } from "../../lib/r2-upload.js";
import { UserRepository } from "../users/user.repository.js";

export class UploadService {
  private readonly users;

  constructor(app: FastifyInstance) {
    this.users = new UserRepository(app.prisma);
  }

  async uploadAvatar(request: FastifyRequest, reply: FastifyReply) {
    const auth = await getAuthenticatedUserId({
      request,
      users: this.users,
    });

    if (!auth.userId) {
      return this.handleUnauthorized(auth.error, reply);
    }

    let file;

    try {
      file = await request.file();
    } catch {
      reply.code(400);
      return { error: "Expected multipart/form-data" };
    }

    if (!file) {
      reply.code(400);
      return { error: "Avatar file is required" };
    }

    if (file.fieldname !== "file") {
      reply.code(400);
      return { error: "Invalid file field" };
    }

    if (!this.isSupportedImageType(file.mimetype)) {
      reply.code(400);
      return { error: "Unsupported image type" };
    }

    const buffer = await file.toBuffer();

    if (!buffer.length) {
      reply.code(400);
      return { error: "Empty file" };
    }

    const avatarId = randomUUID();
    const croppedExtension = this.getExtensionFromContentType(file.mimetype);

    const croppedKey = `avatars/${auth.userId}/${avatarId}/cropped.${croppedExtension}`;

    const uploadedCropped = await uploadToR2({
      key: croppedKey,
      body: buffer,
      contentType: file.mimetype,
    });

    return {
      avatar: {
        croppedKey: uploadedCropped.key,
        croppedUrl: uploadedCropped.url,
      },
    };
  }

  private isSupportedImageType(contentType: string) {
    return (
      contentType === "image/jpeg" ||
      contentType === "image/png" ||
      contentType === "image/webp"
    );
  }

  private getExtensionFromContentType(contentType: string) {
    switch (contentType) {
      case "image/jpeg":
        return "jpg";
      case "image/png":
        return "png";
      case "image/webp":
        return "webp";
      default:
        return "bin";
    }
  }

  private handleUnauthorized(
    error:
      | "missing_authorization_header"
      | "invalid_authorization_header"
      | "invalid_or_expired_access_token"
      | "user_not_found"
      | null,
    reply: FastifyReply,
  ) {
    reply.code(401);

    if (!error) {
      return { error: "Unauthorized" };
    }

    if (error === "missing_authorization_header") {
      return { error: "Missing authorization header" };
    }

    if (error === "invalid_authorization_header") {
      return { error: "Invalid authorization header" };
    }

    if (error === "user_not_found") {
      return { error: "User not found" };
    }

    return { error: "Invalid or expired access token" };
  }
}
