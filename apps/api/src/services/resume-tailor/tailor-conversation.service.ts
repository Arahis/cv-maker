import { randomUUID } from "node:crypto";
import type {
  ConfirmedTailorFact,
  TailorConversationMessage,
  TailorConversationResponse,
  TailorConversationSession,
  TailorConversationTurn,
} from "@cv-maker/shared";
import {
  tailorConversationResponseSchema,
  tailorConversationSessionSchema,
  tailorConversationTurnSchema,
} from "@cv-maker/shared";
import type { PrismaClient, TailorSession } from "../../generated/prisma/client.js";
import { parseTailorResponse } from "./openai-structured.js";
import { prepareTailorInput, type PreparedTailorInput } from "./prepare-tailor-input.js";
import { TAILOR_CONVERSATION_INSTRUCTIONS } from "./tailor.instructions.js";
import { env } from "../../config/env.js";
import { normalizeTailorChoiceAnswer } from "./tailor-conversation.utils.js";

type JobInput = { jobTitle: string; jobDescription: string };
const MAX_CLARIFICATION_TURNS = 4;

export class TailorConversationService {
  constructor(private readonly prisma: PrismaClient) {}

  async create({ userId, resumeId, resumeData, job }: { userId: string; resumeId: string; resumeData: unknown; job: JobInput }): Promise<TailorConversationSession> {
    const resume = prepareTailorInput(resumeData as Parameters<typeof prepareTailorInput>[0]);
    const response = await this.nextTurn({ resume, job, messages: [], confirmedFacts: [], phase: "initial" });
    // There are no user messages yet, so the model cannot create candidate facts
    // during the initial analysis. It may ask questions, but it must not invent
    // confirmed evidence from the resume/job pair alone.
    const safeFacts = sanitizeFacts(response.confirmedFacts, resume, []);
    const now = new Date().toISOString();
    const messages: TailorConversationMessage[] = [{ id: randomUUID(), role: "assistant", text: response.turn.message, createdAt: now }];
    const session = await this.prisma.tailorSession.create({
      data: {
        userId,
        resumeId,
        jobTitle: job.jobTitle,
        jobDescription: job.jobDescription,
        normalizedResume: resume,
        status: response.turn.type === "complete" ? "readyToGenerate" : "clarifying",
        messages,
        confirmedFacts: safeFacts,
        currentTurn: response.turn,
        ...(response.initialAnalysis ? { initialAnalysis: response.initialAnalysis } : {}),
      },
    });
    return toSession(session);
  }

  async get(userId: string, resumeId: string, id: string): Promise<TailorConversationSession | null> {
    const session = await this.prisma.tailorSession.findFirst({ where: { id, userId, resumeId } });
    return session ? toSession(session) : null;
  }

  async message({ userId, resumeId, id, messageId, text }: { userId: string; resumeId: string; id: string; messageId: string; text: string }): Promise<TailorConversationSession | null> {
    const session = await this.prisma.tailorSession.findFirst({ where: { id, userId, resumeId } });
    if (!session) return null;
    const messages = parseMessages(session.messages);
    const existing = messages.find((message) => message.id === messageId);
    if (existing) return toSession(session);
    if (session.status !== "clarifying") return toSession(session);

    const userMessage: TailorConversationMessage = { id: messageId, role: "user", text, createdAt: new Date().toISOString() };
    const facts = parseFacts(session.confirmedFacts);
    const nextMessages = [...messages, userMessage];
    const currentTurn = tailorConversationTurnSchema.parse(session.currentTurn);
    const messagesForModel = addSelectionInterpretation(nextMessages, currentTurn);
    const response = await this.nextTurn({
      resume: parsePreparedResume(session.normalizedResume),
      job: { jobTitle: session.jobTitle, jobDescription: session.jobDescription },
      messages: messagesForModel,
      confirmedFacts: facts,
      phase: "conversation",
    });
    const preparedResume = parsePreparedResume(session.normalizedResume);
    // The model is instructed to return the complete fact list, but persistence
    // should not make previously confirmed facts disappear if it omits one.
    const safeFacts = mergeConfirmedFacts(
      facts,
      response.confirmedFacts,
      preparedResume,
      nextMessages,
    );
    const boundedTurn = countClarificationTurns(nextMessages) > MAX_CLARIFICATION_TURNS
      ? { type: "complete" as const, message: "That's enough information to prepare the tailored version." }
      : response.turn;
    const assistantMessage: TailorConversationMessage = { id: randomUUID(), role: "assistant", text: boundedTurn.message, createdAt: new Date().toISOString() };
    const updated = await this.prisma.tailorSession.update({
      where: { id: session.id },
      data: {
        messages: [...nextMessages, assistantMessage],
        confirmedFacts: safeFacts,
        currentTurn: boundedTurn,
        status: boundedTurn.type === "complete" ? "readyToGenerate" : "clarifying",
      },
    });
    return toSession(updated);
  }

  async markGenerated(userId: string, resumeId: string, id: string): Promise<void> {
    await this.prisma.tailorSession.updateMany({ where: { id, userId, resumeId }, data: { status: "generated" } });
  }

  private nextTurn(input: { resume: PreparedTailorInput; job: JobInput; messages: TailorConversationMessage[]; confirmedFacts: ConfirmedTailorFact[]; phase: "initial" | "conversation" }): Promise<TailorConversationResponse> {
    return parseTailorResponse(
      tailorConversationResponseSchema,
      "tailor_clarification_turn",
      TAILOR_CONVERSATION_INSTRUCTIONS,
      input,
      env.openAiTailorClarificationModel,
    );
  }
}

function parseMessages(value: unknown): TailorConversationMessage[] {
  return Array.isArray(value) ? value.filter((message): message is TailorConversationMessage => typeof message === "object" && message !== null && "id" in message && "role" in message && "text" in message && "createdAt" in message) : [];
}

function parseFacts(value: unknown): ConfirmedTailorFact[] {
  return Array.isArray(value) ? value as ConfirmedTailorFact[] : [];
}

function parsePreparedResume(value: unknown): PreparedTailorInput {
  return value as PreparedTailorInput;
}

export function countClarificationTurns(messages: TailorConversationMessage[]): number {
  // Assistant messages include the initial greeting and every generated turn, so
  // counting them caps the conversation one turn too early. User messages are the
  // actual submitted clarification turns and remain available without new state.
  return messages.filter((message) => message.role === "user").length;
}

function addSelectionInterpretation(messages: TailorConversationMessage[], turn: TailorConversationTurn): TailorConversationMessage[] {
  if (turn.type !== "choice" || messages.length === 0) return messages;
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") return messages;
  const values = normalizeTailorChoiceAnswer(last.text, turn.options);
  if (!values) return messages;
  return [...messages.slice(0, -1), { ...last, text: `${last.text}\n[Explicitly selected all offered options: ${values}]` }];
}

export function sanitizeFacts(facts: ConfirmedTailorFact[], resume: PreparedTailorInput, messages: TailorConversationMessage[]): ConfirmedTailorFact[] {
  const experienceIds = new Set(resume.workExperience.map((experience) => experience.id));
  const messageIds = new Set(messages.map((message) => message.id));
  const userMessageIds = new Set(messages.filter((message) => message.role === "user").map((message) => message.id));
  return facts
    .map((fact) => ({
      ...fact,
      relatedExperienceIds: fact.relatedExperienceIds.filter((id) => experienceIds.has(id)),
      primaryTarget: fact.primaryTarget?.section === "workExperience" && !experienceIds.has(fact.primaryTarget.experienceId)
        ? null
        : fact.primaryTarget,
      sourceMessageIds: fact.sourceMessageIds.filter((id) => messageIds.has(id) && userMessageIds.has(id)),
    }))
    .filter((fact) => {
      // Confirmed/partial facts need a real user message as provenance. Rejected
      // facts also need provenance so an invented rejection cannot affect output.
      if (fact.sourceMessageIds.length === 0) return false;
      return fact.status === "rejected" || Boolean(fact.statement?.trim());
    });
}

export function mergeConfirmedFacts(
  previous: ConfirmedTailorFact[],
  next: ConfirmedTailorFact[],
  resume: PreparedTailorInput,
  messages: TailorConversationMessage[],
): ConfirmedTailorFact[] {
  const merged = new Map(sanitizeFacts(previous, resume, messages).map((fact) => [fact.id, fact]));
  for (const fact of sanitizeFacts(next, resume, messages)) merged.set(fact.id, fact);
  return [...merged.values()];
}

function toSession(session: TailorSession): TailorConversationSession {
  return tailorConversationSessionSchema.parse({
    id: session.id,
    resumeId: session.resumeId,
    jobTitle: session.jobTitle,
    jobDescription: session.jobDescription,
    status: session.status,
    messages: session.messages,
    turn: session.currentTurn,
    initialAnalysis: session.initialAnalysis,
    confirmedFacts: session.confirmedFacts,
  });
}
