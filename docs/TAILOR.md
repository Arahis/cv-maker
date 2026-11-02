# Tailor: How It Works

Tailor is a server-side module that adapts a resume to a specific job. It uses the
source resume, the job description, and candidate facts explicitly confirmed by the
user. The job description guides relevance and priorities, but is never evidence of
the candidate's experience.

Tailor currently has no frontend UI in `apps/web`. Its server APIs and data models
remain available for future use.

## Overall flow

```text
Resume from the database
    ↓
prepareTailorInput()
    ↓
Normalized resume + job + user answers
    ↓
OpenAI structured output
    ↓
Zod result validation
    ↓
Additional server-side provenance validation
    ↓
TailorGenerationResult or TailorRefinementResult
```

Main layers:

- `packages/shared/src/schemas/tailor.ts` — shared Zod schemas and TypeScript types;
- `apps/api/src/modules/resumes/resume.route.ts` — HTTP routes;
- `apps/api/src/modules/resumes/resume.service.ts` — authentication, resume ownership
  checks, and Tailor service calls;
- `apps/api/src/services/resume-tailor/prepare-tailor-input.ts` — input preparation;
- `apps/api/src/services/resume-tailor/tailor.service.ts` — generation and refinement;
- `apps/api/src/services/resume-tailor/tailor-conversation.service.ts` — fact
  clarification conversation;
- `apps/api/src/services/resume-tailor/tailor.instructions.ts` — model instructions;
- `apps/api/prisma/schema.prisma` — Tailor session persistence.

## Resume preparation

`prepareTailorInput()` converts the full `ResumeForm` into a compact structure for the
model:

- Summary is converted from Lexical JSON to plain text;
- work-experience bullets receive stable IDs and plain-text content;
- position, company, dates, and city are preserved;
- skills remain separated into `technical` and `personal`;
- education, languages, social links, and custom sections are included.

Lexical content is first parsed using the registered Lexical nodes. If the state is
old or malformed, a fallback extracts serialized text nodes.

The prepared input is validated by `tailorResumeInputSchema`, preventing unexpected
data shapes from being sent to the model.

## HTTP API

Tailor routes are registered under `/resumes` and require an authenticated user.

### Create a Tailor session

```http
POST /resumes/:resumeId/tailor/session
```

Request body:

```json
{
  "jobTitle": "Senior Product Designer",
  "jobDescription": "..."
}
```

The service:

1. validates the access token;
2. verifies that the resume belongs to the user;
3. normalizes the resume;
4. asks the model to perform an initial analysis;
5. persists the session in `TailorSession`.

A session has one of three statuses:

- `clarifying` — more information is needed;
- `readyToGenerate` — there is enough information to generate the tailored resume;
- `generated` — generation has completed for the session.

### Get a session

```http
GET /resumes/:resumeId/tailor/session/:sessionId
```

The session is queried by `id`, `userId`, and `resumeId`, so a user cannot access
another user's Tailor session.

### Answer a clarification question

```http
POST /resumes/:resumeId/tailor/session/:sessionId/messages
```

Request body:

```json
{
  "messageId": "client-message-id",
  "text": "I used this process on two projects"
}
```

Resubmitting the same `messageId` is idempotent. If the session is no longer in the
`clarifying` state, the existing session is returned without another model call.

The conversation is limited to four user clarification turns. After that limit is
reached, the server forces the session into `readyToGenerate`.

### Generate or refine a resume

```http
POST /resumes/:resumeId/tailor
```

The `mode` field selects one of two workflows.

#### `mode: "generate"`

Generates a complete recommended resume. It can also receive:

- `answers` — answers to clarification questions;
- `confirmedFacts` — facts confirmed by the user;
- `confirmedSkills` — explicitly confirmed skills;
- `sessionId` — the session to mark as `generated` after a successful result.

#### `mode: "refine"`

Rewrites only the selected target. It receives:

- `target` — Summary, Skills, an entire work experience, or one work-experience
  bullet;
- `userInstruction`;
- `currentValue` and the original value;
- answers and confirmed skills.

Before refinement, the server verifies that the selected work experience and bullet
exist in the source resume.

## Conversation flow

`TailorConversationService` works in two stages.

### Initial analysis

When a session is created, the model receives the normalized resume and job. It may:

- return a short overview;
- identify strengths;
- suggest changes;
- identify important gaps;
- ask clarification questions or finish the information-gathering stage.

At this stage, the model cannot create a confirmed candidate fact because the user has
not provided any new information yet.

### Follow-up messages

When the user responds, the server:

1. loads the current session;
2. checks the `messageId` and session status;
3. appends the user message;
4. if the current turn is a choice, explicitly adds the selected options to the model
   context;
5. requests the next structured response;
6. sanitizes and merges confirmed facts;
7. saves the new message, turn, and status.

A confirmed fact must have provenance:

- an existing `sourceMessageId` belonging to a user message;
- an existing `relatedExperienceId`, when one is provided;
- a non-empty statement for `confirmed` or `partial` facts.

This prevents the model from inventing facts based only on the job description.

## Generation result format

The result contains `recommendedResume`.

Each work experience returns an ordered list of operations:

```json
[
  { "type": "rewrite", "sourceEntryId": "bullet-1", "text": "..." },
  { "type": "preserve", "sourceEntryId": "bullet-2" },
  { "type": "add", "text": "..." }
]
```

Rules:

- `preserve` keeps the original bullet;
- `rewrite` changes the text while preserving its link to the source bullet;
- `add` is only for a separate, confirmed fact;
- operation order becomes the final bullet order;
- every original bullet must remain represented.

## Server-side validation after model output

Zod validation alone is not enough, so `ResumeTailorService` additionally:

1. checks coverage for every `confirmedFact`;
2. restores missing source work-experience entries as `preserve` operations;
3. rejects unknown or reused `sourceEntryId` values;
4. checks that existing skills keep their original IDs and names;
5. rejects duplicate skills;
6. allows new skills only when they are explicitly confirmed or supported by resume
   evidence;
7. protects an explicitly stated duration in Summary from being replaced with a
   different number.

The model instructions also prohibit inventing responsibilities, technologies,
metrics, ownership, seniority, outcomes, or other unsupported candidate attributes.

## What Tailor does not do

- It does not directly update a resume in the database.
- It does not automatically create a new Resume.
- It does not treat job-description text as proof of experience.
- It does not have to include every job requirement.
- It does not move a confirmed fact to a different job just because that job matches
  the vacancy better.

The service returns a structured result. Applying that result to a resume is the
responsibility of a separate calling layer.

## Related files

- [Shared Tailor schemas](../packages/shared/src/schemas/tailor.ts)
- [Resume routes](../apps/api/src/modules/resumes/resume.route.ts)
- [Resume service](../apps/api/src/modules/resumes/resume.service.ts)
- [Tailor service](../apps/api/src/services/resume-tailor/tailor.service.ts)
- [Conversation service](../apps/api/src/services/resume-tailor/tailor-conversation.service.ts)
- [Input preparation](../apps/api/src/services/resume-tailor/prepare-tailor-input.ts)
- [Tailor instructions](../apps/api/src/services/resume-tailor/tailor.instructions.ts)
