import type { FastifyInstance } from "fastify";
import { UploadService } from "./upload.service.js";

export default async function uploadRoutes(app: FastifyInstance) {
  const uploadService = new UploadService(app);

  app.post("/avatar", async (request, reply) => {
    return uploadService.uploadAvatar(request, reply);
  });
}
