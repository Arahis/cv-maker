import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { verifyAccessToken } from "../../lib/jwt.js";
import { UserRepository } from "../users/user.repository.js";
import { ResumeRepository } from "./resume.repository.js";
import type { CreateResumeBody, UpdateResumeBody } from "./resume.schema.js";

export class ResumeService {
  private readonly users;
  private readonly resumes;

  constructor(app: FastifyInstance) {
    this.users = new UserRepository(app.prisma);
    this.resumes = new ResumeRepository(app.prisma);
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const userId = await this.getAuthenticatedUserId(request, reply);

    if (!userId) {
      return { error: "Unauthorized" };
    }

    return {
      resumes: await this.resumes.findManyByUserId(userId),
    };
  }

  async get(id: string, request: FastifyRequest, reply: FastifyReply) {
    const userId = await this.getAuthenticatedUserId(request, reply);

    if (!userId) {
      return { error: "Unauthorized" };
    }

    const resume = await this.resumes.findByUserIdAndId(userId, id);

    if (!resume) {
      reply.code(404);
      return { error: "Resume not found" };
    }

    return { resume };
  }

  async create(
    input: CreateResumeBody,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const userId = await this.getAuthenticatedUserId(request, reply);

    if (!userId) {
      return { error: "Unauthorized" };
    }

    const resume = await this.resumes.create({
      userId,
      ...(input.data.title !== undefined ? { title: input.data.title } : {}),
      ...(input.data.description !== undefined
        ? { description: input.data.description }
        : {}),
      template: input.template,
      data: input.data,
      media: input.media,
    });

    reply.code(201);

    return { resume };
  }

  async update(
    id: string,
    input: UpdateResumeBody,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const userId = await this.getAuthenticatedUserId(request, reply);

    if (!userId) {
      return { error: "Unauthorized" };
    }

    const existingResume = await this.resumes.findByUserIdAndId(userId, id);

    if (!existingResume) {
      reply.code(404);
      return { error: "Resume not found" };
    }

    const existingData =
      typeof existingResume.data === "object" && existingResume.data !== null
        ? (existingResume.data as Record<string, unknown>)
        : {};

    const data = input.data ? { ...existingData, ...input.data } : undefined;

    const resume = await this.resumes.update(id, {
      ...(data ? { data } : {}),
      ...(input.media ? { media: input.media } : {}),
      ...(input.template ? { template: input.template } : {}),
      ...(input.data?.title !== undefined ? { title: input.data.title } : {}),
      ...(input.data?.description !== undefined
        ? { description: input.data.description }
        : {}),
    });

    return { resume };
  }

  async delete(id: string, request: FastifyRequest, reply: FastifyReply) {
    const userId = await this.getAuthenticatedUserId(request, reply);

    if (!userId) {
      return { error: "Unauthorized" };
    }

    const deleted = await this.resumes.deleteByUserIdAndId(userId, id);

    if (!deleted) {
      reply.code(404);
      return { error: "Resume not found" };
    }

    return { success: true };
  }

  private async getAuthenticatedUserId(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<string | null> {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      reply.code(401);
      return null;
    }

    try {
      const token = authHeader.slice("Bearer ".length);
      const payload = verifyAccessToken(token);
      const user = await this.users.findById(payload.sub);

      if (!user) {
        reply.code(401);
        return null;
      }

      return user.id;
    } catch {
      reply.code(401);
      return null;
    }
  }
}
