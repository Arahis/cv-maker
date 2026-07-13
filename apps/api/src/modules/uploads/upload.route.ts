import type { FastifyInstance } from "fastify";
import multipart from "@fastify/multipart";
import { UploadService } from "./upload.service.js";

export default async function uploadRoutes(app: FastifyInstance) {
  // Multipart plugin is required for handling file uploads.
  // Has to be here because the upload service uses it, and the upload service is used in this route.
  await app.register(multipart);

  const uploadService = new UploadService(app);

  app.post("/avatar", async (request, reply) => {
    return uploadService.uploadAvatar(request, reply);
  });
}
