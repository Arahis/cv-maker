import type { ResumeForm } from "@cv-maker/shared";

export type PreparedTailorInput = {
  summary: {
    id: "summary";
    text: string;
  };
  workExperience: Array<{
    id: string;
    position: string;
    company: string;
    city: string;
    startDate: string;
    endDate: string;
    descriptions: Array<{
      id: string;
      text: string;
    }>;
  }>;
  skills: {
    technical: Array<{ id: string; name: string }>;
    personal: Array<{ id: string; name: string }>;
  };
};

type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
};

function lexicalStateToText(state: string): string {
  try {
    const root = JSON.parse(state) as LexicalNode;

    const visit = (node: LexicalNode): string => {
      if (node.type === "text") {
        return node.text ?? "";
      }

      const children = node.children?.map(visit) ?? [];
      const separator =
        node.type === "paragraph" ||
        node.type === "listitem" ||
        node.type === "list"
          ? "\n"
          : "";

      return children.join(separator);
    };

    return visit(root).trim();
  } catch {
    return state.trim();
  }
}

export function prepareTailorInput(resume: ResumeForm): PreparedTailorInput {
  return {
    summary: {
      id: "summary",
      text: resume.summary ?? "",
    },
    workExperience: (resume.workExperiences ?? []).map((experience) => ({
      id: experience.id,
      position: experience.position ?? "",
      company: experience.company ?? "",
      city: experience.city ?? "",
      startDate: experience.startDate ?? "",
      endDate: experience.endDate ?? "",
      descriptions: experience.descriptionBullets.map((bullet) => ({
        id: bullet.id,
        text: lexicalStateToText(bullet.text),
      })),
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
  };
}
