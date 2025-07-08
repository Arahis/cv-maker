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
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
});

export type WorkExperienceForm = z.infer<typeof workExperienceSchema>;

export const resumeSchema = z.object({
  ...generalFormSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
});

export type ResumeForm = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string; // Optional ID for existing resumes
  photo?: File | string | null;
};
