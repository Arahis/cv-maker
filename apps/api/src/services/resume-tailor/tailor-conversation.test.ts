import test from "node:test";
import assert from "node:assert/strict";
import { normalizeTailorChoiceAnswer } from "./tailor-conversation.utils.js";
import { countClarificationTurns, sanitizeFacts } from "./tailor-conversation.service.js";

test("normalizes all and both against the immediately offered semantic choices", () => {
  const options = [{ value: "implemented" }, { value: "collaborated" }];

  assert.equal(normalizeTailorChoiceAnswer("both", options), "implemented; collaborated");
  assert.equal(normalizeTailorChoiceAnswer("all of them", options), "implemented; collaborated");
  assert.equal(normalizeTailorChoiceAnswer("mostly the second one", options), null);
});

test("counts user clarification turns rather than assistant messages", () => {
  assert.equal(countClarificationTurns([
    { id: "a1", role: "assistant", text: "Question", createdAt: "now" },
    { id: "u1", role: "user", text: "Answer", createdAt: "now" },
    { id: "a2", role: "assistant", text: "Next question", createdAt: "now" },
  ]), 1);
});

test("requires facts to cite user messages and preserves rejected provenance", () => {
  const resume = {
    summary: null,
    workExperience: [{ id: "exp-1", position: "", company: "", city: "", startDate: null, endDate: null, description: "", bullets: [] }],
    education: [],
    skills: { technical: [], personal: [] },
    languages: [],
    socialLinks: [],
    customSections: [],
  };
  const facts = sanitizeFacts([
    { id: "invented", topic: "x", status: "confirmed", statement: "Invented", primaryTarget: null, relatedExperienceIds: [], involvement: null, sourceMessageIds: [] },
    { id: "rejected", topic: "x", status: "rejected", statement: null, primaryTarget: null, relatedExperienceIds: ["missing"], involvement: null, sourceMessageIds: ["u1"] },
  ], resume, [
    { id: "u1", role: "user", text: "No", createdAt: "now" },
  ]);
  assert.deepEqual(facts, [{
    id: "rejected", topic: "x", status: "rejected", statement: null, primaryTarget: null,
    relatedExperienceIds: [], involvement: null, sourceMessageIds: ["u1"],
  }]);
});
