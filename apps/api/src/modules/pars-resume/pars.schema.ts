import { z } from "zod";

const importedWorkExperienceSchema = z.object({
  position: z.string(),
  company: z.string(),
  city: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

const importedEducationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  city: z.string(),
});

const importedLanguageSchema = z.object({
  languageName: z.string(),
  languageLevel: z.string(),
});

const importedSocialLinkSchema = z.object({
  linkName: z.string(),
  linkAddress: z.string(),
});

const importedCustomSectionSchema = z.object({
  sectionName: z.string(),
  sectionItems: z.array(
    z.object({
      title: z.string(),
      value: z.string(),
    }),
  ),
});

export const importedResumeSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  jobTitle: z.string(),
  city: z.string(),
  country: z.string(),
  phone: z.string(),
  email: z.string(),

  workExperiences: z.array(importedWorkExperienceSchema),
  educations: z.array(importedEducationSchema),
  languages: z.array(importedLanguageSchema),

  skills: z.object({
    technical: z.array(z.string()),
    personal: z.array(z.string()),
  }),

  summary: z.string(),

  customSections: z.array(importedCustomSectionSchema),
  socialLinks: z.array(importedSocialLinkSchema),
});

export type ImportedResume = z.infer<typeof importedResumeSchema>;
