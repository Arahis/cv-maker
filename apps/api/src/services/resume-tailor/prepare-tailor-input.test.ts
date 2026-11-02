import assert from "node:assert/strict";
import { test } from "node:test";
import type { ResumeForm } from "@cv-maker/shared";
import { lexicalStateToText, prepareTailorInput } from "./prepare-tailor-input.js";

function lexicalDocument(...children: unknown[]) {
  return JSON.stringify({ root: { type: "root", version: 1, children } });
}

function paragraph(text: string) {
  return { type: "paragraph", version: 1, children: [{ type: "text", version: 1, text }] };
}

test("converts summary paragraphs into readable text", () => {
  const result = lexicalStateToText(lexicalDocument(paragraph("First paragraph"), paragraph("Second paragraph")));
  assert.equal(result, "First paragraph\nSecond paragraph");
});

test("preserves work-experience list items and mixed blocks", () => {
  const result = lexicalStateToText(lexicalDocument(
    paragraph("Worked on a product"),
    { type: "list", listType: "bullet", children: [
      { type: "listitem", children: [paragraph("First bullet")] },
      { type: "listitem", children: [paragraph("Second bullet")] },
    ] },
    { type: "heading", children: [{ type: "text", text: "Technologies: React, TypeScript" }] },
  ));
  assert.match(result, /Worked on a product/);
  assert.match(result, /First bullet/);
  assert.match(result, /Second bullet/);
  assert.match(result, /Technologies: React, TypeScript/);
});

test("handles empty and malformed rich text deterministically", () => {
  assert.equal(lexicalStateToText(lexicalDocument()), "");
  assert.equal(lexicalStateToText("not-json text"), "not-json text");
  assert.match(lexicalStateToText('{"root":{"children":[{"type":"text","text":"Recovered"}]}}'), /Recovered/);
});

test("prepareTailorInput preserves summary and complete experience content", () => {
  const summary = lexicalDocument(paragraph("4 years of commercial frontend experience"));
  const firstBullet = lexicalDocument(paragraph("Built a product from scratch with React and TypeScript."));
  const secondBullet = lexicalDocument(paragraph("Contributed to performance optimization and code reviews."));
  const resume = {
    summary,
    workExperiences: [{
      id: "experience-1", position: "Frontend Developer", company: "Example", city: "Remote",
      startDate: "2020", endDate: "2024", isFullDate: false,
      descriptionBullets: [{ id: "bullet-1", text: firstBullet }, { id: "bullet-2", text: secondBullet }],
    }],
    skills: { technical: [{ id: "skill-1", name: "React" }], personal: [{ id: "skill-2", name: "Communication" }] },
    educations: [], languages: [], socialLinks: [], customSections: [],
  } as unknown as ResumeForm;

  const normalized = prepareTailorInput(resume);
  assert.equal(normalized.summary, "4 years of commercial frontend experience");
  assert.equal(normalized.workExperience[0]?.bullets.length, 2);
  assert.match(normalized.workExperience[0]?.description ?? "", /performance optimization/);
  assert.match(normalized.workExperience[0]?.description ?? "", /code reviews/);
  assert.equal(normalized.skills.technical[0]?.name, "React");
});
