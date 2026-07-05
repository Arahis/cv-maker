import type { PrismaClient, Prisma } from "../../generated/prisma/client.js";

export type Resume = {
  id: string;
  userId: string;
  title: string | null;
  description: string | null;
  template: string;
  data: Prisma.JsonValue;
  media: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
};

type ResumeDelegate = {
  findMany(args: unknown): Promise<Resume[]>;
  findFirst(args: unknown): Promise<Resume | null>;
  create(args: unknown): Promise<Resume>;
  update(args: unknown): Promise<Resume>;
  deleteMany(args: unknown): Promise<{ count: number }>;
};

type CreateResumeInput = {
  userId: string;
  template: string;
  data: Prisma.InputJsonValue;
  media: Prisma.InputJsonValue;
};

type CreateFromLocalResumeInput = {
  userId: string;
  template: string;
  data: Prisma.InputJsonValue;
  media: Prisma.InputJsonValue;
  localResumeId: string;
};

type UpdateResumeInput = {
  template?: string;
  data?: Prisma.InputJsonValue;
  media?: Prisma.InputJsonValue;
};

export class ResumeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findManyByUserId(userId: string): Promise<Resume[]> {
    return this.prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  }

  findByUserIdAndId(userId: string, id: string): Promise<Resume | null> {
    return this.prisma.resume.findFirst({
      where: { id, userId },
    });
  }

  create(input: CreateResumeInput): Promise<Resume> {
    return this.prisma.resume.create({
      data: {
        userId: input.userId,
        template: input.template,
        data: input.data,
        media: input.media,
      },
    });
  }

  upsertResumeFromLocal(input: CreateFromLocalResumeInput): Promise<Resume> {
    return this.prisma.resume.upsert({
      where: {
        userId_localResumeId: {
          userId: input.userId,
          localResumeId: input.localResumeId,
        },
      },
      create: {
        userId: input.userId,
        localResumeId: input.localResumeId,
        data: input.data,
        media: input.media,
      },
      update: {
        data: input.data,
        media: input.media,
      },
    });
  }

  update(id: string, input: UpdateResumeInput): Promise<Resume> {
    return this.prisma.resume.update({
      where: { id },
      data: input,
    });
  }

  async deleteByUserIdAndId(userId: string, id: string): Promise<boolean> {
    const result = await this.prisma.resume.deleteMany({
      where: { id, userId },
    });

    return result.count > 0;
  }
}
