import type {
  PrismaClient,
  Prisma,
  Resume,
} from "../../generated/prisma/client.js";

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
  position?: number;
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
      orderBy: { position: "asc" },
    });
  }

  findUserResumeById(userId: string, id: string): Promise<Resume | null> {
    return this.prisma.resume.findFirst({
      where: { id, userId },
    });
  }

  create(input: CreateResumeInput): Promise<Resume> {
    return this.getNextPosition(input.userId).then((position) =>
      this.prisma.resume.create({
        data: {
          userId: input.userId,
          template: input.template,
          data: input.data,
          media: input.media,
          position: input.position ?? position,
        },
      }),
    );
  }

  private async getNextPosition(userId: string): Promise<number> {
    const lastResume = await this.prisma.resume.findFirst({
      where: { userId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    return (lastResume?.position ?? 0) + 1000;
  }

  async copyResume(userId: string, id: string): Promise<Resume | null> {
    const resume = await this.findUserResumeById(userId, id);

    if (!resume) {
      return null;
    }

    const data = resume.data as Prisma.JsonObject;

    return this.create({
      userId,
      template: resume.template,
      data: {
        ...data,
        title:
          typeof data.title === "string" && data.title
            ? `${data.title} (Copy)`
            : "Untitled (Copy)",
      },
      media: resume.media as Prisma.InputJsonValue,
      position: await this.insertAfter(userId, resume.id, resume.position),
    });
  }

  private async insertAfter(
    userId: string,
    resumeId: string,
    position: number,
  ): Promise<number> {
    const nextResume = await this.prisma.resume.findFirst({
      where: {
        userId,
        position: { gt: position },
      },
      orderBy: { position: "asc" },
      select: { position: true },
    });

    if (!nextResume || nextResume.position - position > 1) {
      return nextResume
        ? Math.floor((position + nextResume.position) / 2)
        : position + 1000;
    }

    const resumes = await this.prisma.resume.findMany({
      where: { userId },
      orderBy: { position: "asc" },
      select: { id: true },
    });

    await Promise.all(
      resumes.map((resume, index) =>
        this.prisma.resume.update({
          where: { id: resume.id },
          data: { position: (index + 1) * 1000 },
        }),
      ),
    );

    const resumeIndex = resumes.findIndex((resume) => resume.id === resumeId);
    const normalizedPosition = (resumeIndex + 1) * 1000;
    return normalizedPosition + (nextResume ? 500 : 1000);
  }

  async upsertResumeFromLocal(
    input: CreateFromLocalResumeInput,
  ): Promise<Resume> {
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
        template: input.template,
        data: input.data,
        media: input.media,
        position: await this.getNextPosition(input.userId),
      },
      update: {
        template: input.template,
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
