import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getAuthenticatedUserId } from "../../lib/get-authenticated-user-id.js";
import { UserRepository } from "../users/user.repository.js";
import { ResumeRepository } from "./resume.repository.js";
import type {
  CreateResumeBody,
  SaveLocalResumeToAccountBody,
  UpdateResumeMediaBody,
  UpdateResumeBody,
  UpdateResumeTemplateBody,
} from "./resume.schema.js";

export class ResumeService {
  private readonly users;
  private readonly resumes;

  constructor(app: FastifyInstance) {
    this.users = new UserRepository(app.prisma);
    this.resumes = new ResumeRepository(app.prisma);
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const auth = await getAuthenticatedUserId({
      request,
      users: this.users,
    });

    if (!auth.userId) {
      return this.handleUnauthorized(auth.error, reply);
    }

    return {
      resumes: await this.resumes.findManyByUserId(auth.userId),
    };
  }

  async get(id: string, request: FastifyRequest, reply: FastifyReply) {
    const auth = await getAuthenticatedUserId({
      request,
      users: this.users,
    });

    if (!auth.userId) {
      return this.handleUnauthorized(auth.error, reply);
    }

    const resume = await this.resumes.findUserResumeById(auth.userId, id);

    if (!resume) {
      reply.code(404);
      return { error: "Resume not found" };
    }

    return { resume };
  }

  async copy(id: string, request: FastifyRequest, reply: FastifyReply) {
    const auth = await getAuthenticatedUserId({
      request,
      users: this.users,
    });

    if (!auth.userId) {
      return this.handleUnauthorized(auth.error, reply);
    }

    const resume = await this.resumes.copyResume(auth.userId, id);

    if (!resume) {
      reply.code(404);
      return { error: "Resume not found" };
    }

    reply.code(201);
    return { resume };
  }

  async create(
    input: CreateResumeBody,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const auth = await getAuthenticatedUserId({
      request,
      users: this.users,
    });

    if (!auth.userId) {
      return this.handleUnauthorized(auth.error, reply);
    }

    const resume = await this.resumes.create({
      userId: auth.userId,
      template: input.template,
      data: input.data,
      media: input.media,
    });

    reply.code(201);

    return { resume };
  }

  async createFromLocal(
    input: SaveLocalResumeToAccountBody,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const auth = await getAuthenticatedUserId({
      request,
      users: this.users,
    });

    if (!auth.userId) {
      return this.handleUnauthorized(auth.error, reply);
    }

    const resume = await this.resumes.upsertResumeFromLocal({
      userId: auth.userId,
      template: input.template,
      data: input.data,
      media: input.media,
      localResumeId: input.localResumeId,
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
    const auth = await getAuthenticatedUserId({
      request,
      users: this.users,
    });

    if (!auth.userId) {
      return this.handleUnauthorized(auth.error, reply);
    }

    const existingResume = await this.resumes.findUserResumeById(
      auth.userId,
      id,
    );

    if (!existingResume) {
      reply.code(404);
      return { error: "Resume not found" };
    }

    const resume = await this.resumes.update(id, {
      ...(input.data ? { data: input.data } : {}),
    });

    return { resume };
  }

  async updateTemplate(
    id: string,
    input: UpdateResumeTemplateBody,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const auth = await getAuthenticatedUserId({
      request,
      users: this.users,
    });

    if (!auth.userId) {
      return this.handleUnauthorized(auth.error, reply);
    }

    const existingResume = await this.resumes.findUserResumeById(
      auth.userId,
      id,
    );

    if (!existingResume) {
      reply.code(404);
      return { error: "Resume not found" };
    }

    const resume = await this.resumes.update(id, {
      template: input.template,
    });

    return { resume };
  }

  async updateMedia(
    id: string,
    input: UpdateResumeMediaBody,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const auth = await getAuthenticatedUserId({
      request,
      users: this.users,
    });

    if (!auth.userId) {
      return this.handleUnauthorized(auth.error, reply);
    }

    const existingResume = await this.resumes.findUserResumeById(
      auth.userId,
      id,
    );

    if (!existingResume) {
      reply.code(404);
      return { error: "Resume not found" };
    }

    const resume = await this.resumes.update(id, {
      media: input.media,
    });

    return { resume };
  }

  async delete(id: string, request: FastifyRequest, reply: FastifyReply) {
    const auth = await getAuthenticatedUserId({
      request,
      users: this.users,
    });

    if (!auth.userId) {
      return this.handleUnauthorized(auth.error, reply);
    }

    const deleted = await this.resumes.deleteByUserIdAndId(auth.userId, id);

    if (!deleted) {
      reply.code(404);
      return { error: "Resume not found" };
    }

    return { success: true };
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
