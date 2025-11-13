import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalFormSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GeneralResumeForm = z.infer<typeof generalFormSchema>;

export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine((file) => !file || file.type.startsWith("image/"), {
      message: "Invalid image file",
    })
    .refine((file) => !file || file.size <= 1024 * 1024 * 4, {
      message: "The file size should be less then 4MB",
    }),
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
        degree: optionalString,
        institution: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        city: optionalString,
        isFullDate: z.boolean().optional(),
        description: optionalString,
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
      technicalSkills: z.array(skillItemSchema).optional(),
      personalSkills: z.array(skillItemSchema).optional(),
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

export type ResumeForm = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string; // Optional ID for existing resumes
  photo?: File | string | null;
};
