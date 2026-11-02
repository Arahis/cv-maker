import type { ResumeForm } from "@cv-maker/shared";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode } from "@lexical/rich-text";
import { $getRoot, createEditor, ParagraphNode, TextNode } from "lexical";
import { z } from "zod";

export const tailorResumeInputSchema = z.object({
  summary: z.string().nullable(),
  workExperience: z.array(
    z.object({
      id: z.string().min(1),
      position: z.string(),
      company: z.string(),
      city: z.string(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      description: z.string(),
      bullets: z.array(
        z.object({
          id: z.string().min(1),
          text: z.string().min(1),
        }),
      ),
    }),
  ),
  education: z.array(
    z.object({
      id: z.string().min(1),
      degree: z.string(),
      institution: z.string(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      city: z.string(),
    }),
  ),
  skills: z.object({
    technical: z.array(
      z.object({ id: z.string().min(1), name: z.string().min(1) }),
    ),
    personal: z.array(
      z.object({ id: z.string().min(1), name: z.string().min(1) }),
    ),
  }),
  languages: z.array(z.object({
    id: z.string().min(1), languageName: z.string(), languageLevel: z.string(),
  })),
  socialLinks: z.array(z.object({
    id: z.string().min(1), linkName: z.string(), linkAddress: z.string(),
  })),
  customSections: z.array(z.object({
    id: z.string().min(1), sectionName: z.string(), items: z.array(z.object({
      id: z.string().min(1), title: z.string(), value: z.string(),
    })),
  })),
});

export type PreparedTailorInput = z.infer<typeof tailorResumeInputSchema>;

export function lexicalStateToText(state: string): string {
  const value = state.trim();
  if (!value) return "";
  if (!value.startsWith("{") && !value.startsWith("[")) return value;

  const recoveredParts = [...value.matchAll(/"text"\s*:\s*"((?:\\.|[^"\\])*)"/g)]
    .map((match) => {
      try {
        return JSON.parse(`"${match[1]}"`) as string;
      } catch {
        return "";
      }
    })
    .filter(Boolean);
  const recoveredText = recoveredParts.join(" ");

  try {
    const editor = createEditor({
      namespace: "CvoopTailor",
      nodes: [ParagraphNode, TextNode, HeadingNode, ListNode, ListItemNode],
      onError: () => undefined,
    });
    const editorState = editor.parseEditorState(value);
    let text = "";
    editorState.read(() => {
      text = $getRoot().getTextContent();
    });
    const normalizedText = text
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{2,}/g, "\n")
      .trim();

    if (normalizedText) {
      // Keep native Lexical output when it contains every serialized text node.
      // This fallback also handles older states whose list node shape is no
      // longer understood by the currently registered node set.
      const missingPart = recoveredParts.some((part) => !normalizedText.includes(part));
      return missingPart ? recoveredText : normalizedText;
    }

    const parsed = JSON.parse(value) as { root?: { children?: unknown[] } };
    if (Array.isArray(parsed.root?.children) && parsed.root.children.length === 0) return "";
  } catch {
    // Fall through to the text-node recovery below for older/malformed states.
  }

  return recoveredText || value;
}

export function prepareTailorInput(resume: ResumeForm): PreparedTailorInput {
  return tailorResumeInputSchema.parse({
    summary: resume.summary ? lexicalStateToText(resume.summary) || null : null,
    workExperience: (resume.workExperiences ?? []).map((experience) => {
      const bullets = experience.descriptionBullets
        .map((bullet) => ({ id: bullet.id, text: lexicalStateToText(bullet.text) }))
        .filter((bullet) => bullet.text);
      return {
        id: experience.id,
        position: experience.position ?? "",
        company: experience.company ?? "",
        city: experience.city ?? "",
        startDate: experience.startDate || null,
        endDate: experience.endDate || null,
        description: bullets.map(({ text }) => text).join("\n"),
        bullets,
      };
    }),
    education: (resume.educations ?? []).map((education) => ({
      id: education.id,
      degree: education.degree ?? "",
      institution: education.institution ?? "",
      startDate: education.startDate || null,
      endDate: education.endDate || null,
      city: education.city ?? "",
    })),
    skills: {
      technical: (resume.skills?.technical ?? []).map((skill) => ({
        id: skill.id,
        name: skill.name,
      })),
      personal: (resume.skills?.personal ?? []).map((skill) => ({
        id: skill.id,
        name: skill.name,
      })),
    },
    languages: (resume.languages ?? []).map((language) => ({
      id: language.id,
      languageName: language.languageName ?? "",
      languageLevel: language.languageLevel ?? "",
    })),
    socialLinks: (resume.socialLinks ?? []).map((link) => ({
      id: link.id,
      linkName: link.linkName ?? "",
      linkAddress: link.linkAddress ?? "",
    })),
    customSections: (resume.customSections ?? []).map((section) => ({
      id: section.id,
      sectionName: section.sectionName ?? "",
      items: (section.sectionItems ?? []).map((item) => ({
        id: item.id,
        title: item.title ?? "",
        value: lexicalStateToText(item.value ?? ""),
      })),
    })),
  });
}

export function debugTailorInput(input: PreparedTailorInput): void {
  if (process.env.NODE_ENV !== "development") return;

  console.debug("[Tailor] normalized input", JSON.stringify(input, null, 2));
}
