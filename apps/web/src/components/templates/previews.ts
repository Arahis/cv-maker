export type TemplateColumns = "oneColumn" | "twoColumns";
export type TemplateKey =
  | "template1"
  | "template2"
  | "template3"
  | "template4"
  | "template5"
  | "template6"
  | "template7"
  | "template8"
  | "template9"
  | "template10";

export const resumeTemplateMetadata = {
  template1: { hasPhoto: true, columns: "twoColumns" },
  template2: { hasPhoto: false, columns: "twoColumns" },
  template3: { hasPhoto: true, columns: "twoColumns" },
  template4: { hasPhoto: false, columns: "twoColumns" },
  template5: { hasPhoto: true, columns: "twoColumns" },
  template6: { hasPhoto: false, columns: "twoColumns" },
  template7: { hasPhoto: false, columns: "oneColumn" },
  template8: { hasPhoto: false, columns: "oneColumn" },
  template9: { hasPhoto: false, columns: "oneColumn" },
  template10: { hasPhoto: true, columns: "oneColumn" },
} as const satisfies Record<
  TemplateKey,
  { hasPhoto: boolean; columns: TemplateColumns }
>;
