import test from "node:test";
import assert from "node:assert/strict";
import { containsSkillEvidence, curateTailorSkills, validateTailorClarificationCoverage } from "./tailor-generation-policy.js";

test("curates supported skills instead of restoring the entire original list", () => {
  const original = [
    { id: "skill-1", name: "Client communication" },
    { id: "skill-2", name: "Inventory planning" },
  ];

  assert.deepEqual(
    curateTailorSkills(
      [{ id: "skill-1", name: "Changed name" }, { id: null, name: "Negotiation" }],
      original,
      "Managed supplier negotiation and client communication",
      [],
    ),
    [{ id: "skill-1", name: "Client communication" }, { id: null, name: "Negotiation" }],
  );
});

test("does not turn an unsupported job-only skill into candidate evidence", () => {
  assert.deepEqual(
    curateTailorSkills(
      [{ id: null, name: "Forecasting" }],
      [],
      "Coordinated schedules",
      [],
    ),
    [],
  );
});

test("rejects unknown source skill IDs", () => {
  assert.deepEqual(
    curateTailorSkills([{ id: "unknown", name: "React" }], [{ id: "known", name: "React" }], "React", []),
    [],
  );
});

test("does not accept substring matches as skill evidence", () => {
  assert.equal(containsSkillEvidence("Worked with Google Analytics", "Go"), false);
  assert.equal(containsSkillEvidence("Проводил переговоры с клиентами", "говор"), false);
  assert.equal(containsSkillEvidence("Built a tool with C++, C# and .NET", "C++"), true);
  assert.equal(containsSkillEvidence("Built a tool with C++, C# and .NET", "C#"), true);
  assert.equal(containsSkillEvidence("Built a tool with C++, C# and .NET", ".NET"), true);
});

test("keeps confirmed skills that are absent from the original Skills section", () => {
  assert.deepEqual(
    curateTailorSkills([{ id: null, name: "Negotiation" }], [], "Managed supplier relationships", ["Negotiation"]),
    [{ id: null, name: "Negotiation" }],
  );
});

test("supports Unicode skills with phrase boundaries", () => {
  assert.equal(containsSkillEvidence("Управление проектами и командой", "Управление проектами"), true);
  assert.equal(containsSkillEvidence("Работал с проектами", "проект"), false);
});

test("requires every confirmed fact to receive a coverage classification", () => {
  const result = {
    recommendedResume: {} as never,
    clarificationCoverage: [{ factId: "fact-1", status: "used" as const, rationale: "Placed in the relevant experience." }],
  };
  validateTailorClarificationCoverage(result, [{
    id: "fact-1",
    topic: "workflow",
    status: "confirmed",
    statement: "Performed the workflow",
    primaryTarget: null,
    relatedExperienceIds: [],
    involvement: null,
    sourceMessageIds: [],
  }]);
  assert.throws(() => validateTailorClarificationCoverage(result, [
    {
      id: "fact-1",
      topic: "workflow",
      status: "confirmed",
      statement: "Performed the workflow",
      primaryTarget: null,
      relatedExperienceIds: [],
      involvement: null,
      sourceMessageIds: [],
    },
    {
      id: "fact-2",
      topic: "result",
      status: "confirmed",
      statement: "No measured result",
      primaryTarget: null,
      relatedExperienceIds: [],
      involvement: null,
      sourceMessageIds: [],
    },
  ]), /incomplete/);
});
