import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalFormSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GeneralResumeForm = z.infer<typeof generalFormSchema>;

const avatarCropDataSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  zoom: z.number().min(1).max(4),
  rotation: z.number().min(0).max(360),
});

export type AvatarCropDataForm = z.infer<typeof avatarCropDataSchema>;

export const personalInfoSchema = z.object({
  avatarCropData: avatarCropDataSchema,
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString, // TODO: add phone number validation later
  email: optionalString, // TODO: add email validation later
});

export type PersonalInfoForm = z.infer<typeof personalInfoSchema>;
export type PersonalInfoKeys = keyof PersonalInfoForm;

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        id: z.string(),
        position: optionalString,
        company: optionalString,
        city: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        isFullDate: z.boolean().optional(),
        description: optionalString,
      }),
    )
    .optional(),
});

export type WorkExperienceForm = z.infer<typeof workExperienceSchema>;

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        id: z.string(),
        degree: optionalString,
        institution: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        city: optionalString,
        isFullDate: z.boolean().optional(),
      }),
    )
    .optional(),
});

export type EducationForm = z.infer<typeof educationSchema>;

const skillItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Skill name must be at least 2 characters"),
});

export const skillsSchema = z.object({
  skills: z
    .object({
      technical: z.array(skillItemSchema).optional(),
      personal: z.array(skillItemSchema).optional(),
    })
    .optional(),
});

export type SkillsForm = z.infer<typeof skillsSchema>;

export const summarySchema = z.object({
  summary: optionalString,
});

export type SummaryForm = z.infer<typeof summarySchema>;

export const resumeSchema = z.object({
  ...generalFormSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...summarySchema.shape,
});

export type ResumeForm = z.infer<typeof resumeSchema>;
