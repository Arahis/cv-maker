import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalFormSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GeneralResumeForm = z.infer<typeof generalFormSchema>;

export const avatarCropDataSchema = z
  .object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
    zoom: z.number().min(1).max(4),
    rotation: z.number().min(0).max(360),
  })
  .optional();

export type AvatarCropDataForm = z.infer<typeof avatarCropDataSchema>;

export const personalInfoSchema = z.object({
  avatarCropData: avatarCropDataSchema,
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || /^[0-9+()\s]+$/.test(v), {
      message: "Phone can contain only digits, +, parentheses and spaces",
    })
    .superRefine((v, ctx) => {
      if (!v) return;

      const plusCount = (v.match(/\+/g) ?? []).length;
      if (plusCount > 1) {
        ctx.addIssue({ code: "custom", message: "Only one + is allowed" });
      }
      if (plusCount === 1 && v.trimStart().indexOf("+") !== 0) {
        ctx.addIssue({ code: "custom", message: "+ must be at the start" });
      }

      const openCount = (v.match(/\(/g) ?? []).length;
      const closeCount = (v.match(/\)/g) ?? []).length;
      if (openCount > 1 || closeCount > 1) {
        ctx.addIssue({
          code: "custom",
          message: "Only one pair of parentheses is allowed",
        });
      }

      const openPos = v.indexOf("(");
      const closePos = v.indexOf(")");
      if (closePos !== -1 && (openPos === -1 || closePos < openPos)) {
        ctx.addIssue({
          code: "custom",
          message: "Parentheses order is invalid",
        });
      }

      if (openPos !== -1 && closePos === -1) {
        ctx.addIssue({
          code: "custom",
          message: "Missing closing parenthesis",
        });
      }
    })
    .optional(),
  email: z.preprocess((v) => {
    const s = String(v ?? "")
      .trim()
      .toLowerCase();
    return s === "" ? undefined : s;
  }, z.email("Invalid email format").optional()),
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
        isFullDate: z.boolean(),
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
        isFullDate: z.boolean(),
      }),
    )
    .optional(),
});

export type EducationForm = z.infer<typeof educationSchema>;

export const languagesSchema = z.object({
  languages: z
    .array(
      z.object({
        id: z.string(),
        languageName: optionalString,
        languageLevel: optionalString,
      }),
    )
    .optional(),
});

export type LanguagesForm = z.infer<typeof languagesSchema>;

export const socialLinksSchema = z.object({
  socialLinks: z
    .array(
      z.object({
        id: z.string(),
        linkName: optionalString,
        linkAddress: optionalString,
      }),
    )
    .optional(),
});

export type SocialLinksForm = z.infer<typeof socialLinksSchema>;

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

const customSectionItemFieldsSchema = z.object({
  id: z.string().optional(),
  title: optionalString,
  value: optionalString,
});

const customSectionItemSchema = z.object({
  id: z.string().optional(),
  sectionName: optionalString,
  sectionItems: z.array(customSectionItemFieldsSchema).optional(),
});

export const customSectionSchema = z.object({
  id: z.string().optional(),
  customSections: z.array(customSectionItemSchema).optional(),
});

export type CustomSectionForm = z.infer<typeof customSectionSchema>;

export const resumeSchema = z.object({
  ...generalFormSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...summarySchema.shape,
  ...languagesSchema.shape,
  ...socialLinksSchema.shape,
  ...customSectionSchema.shape,
});

export type ResumeForm = z.infer<typeof resumeSchema>;

export const resumeTemplateSchema = z.enum([
  "template1",
  "template2",
  "template3",
  "template4",
  "template5",
]);

export type ResumeTemplate = z.infer<typeof resumeTemplateSchema>;

export const resumeMediaSchema = z
  .object({
    avatar: z
      .object({
        original: z.string().optional(),
        cropped: z.string().optional(),
      })
      .optional(),
  })
  .default({});

export type ResumeMedia = z.infer<typeof resumeMediaSchema>;
