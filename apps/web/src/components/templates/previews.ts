export const resumeTemplatesPreview = {
  template1: "/templates/template1.webp",
  template2: "/templates/template2.webp",
  template3: "/templates/template3.webp",
  template4: "/templates/template4.webp",
  template5: "/templates/template5.webp",
  template6: "/templates/template5.webp",
} as const satisfies Record<string, string>;

export type TemplateKey = keyof typeof resumeTemplatesPreview;
