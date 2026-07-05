import { ResumeForm } from "./validation";

export const EMPTY_LEXICAL_STATE =
  '{"root":{"type":"root","version":1,"children":[{"type":"paragraph","version":1,"direction":"ltr","format":"","indent":0,"children":[]} ]}}';

export const avatarCropInitialValues = { x: 0, y: 0, zoom: 1, rotation: 0 };

export const defaultFormValues = (): ResumeForm => ({
  title: "My resume",
  description: "",

  avatarCropData: avatarCropInitialValues,
  firstName: "",
  lastName: "",
  jobTitle: "",
  city: "",
  country: "",
  phone: "",
  email: "",

  workExperiences: [
    {
      id: crypto.randomUUID(),
      position: "",
      company: "",
      city: "",
      startDate: "",
      endDate: "",
      description: EMPTY_LEXICAL_STATE,
      isFullDate: false,
    },
  ],
  educations: [
    {
      id: crypto.randomUUID(),
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      city: "",
      isFullDate: false,
    },
  ],
  languages: [{ id: crypto.randomUUID(), languageName: "", languageLevel: "" }],
  skills: { technical: [], personal: [] },
  summary: "",
  customSections: [
    {
      id: crypto.randomUUID(),
      sectionName: "",
      sectionItems: [
        {
          id: crypto.randomUUID(),
          title: "",
          value: "",
        },
      ],
    },
  ],
  socialLinks: [{ id: crypto.randomUUID(), linkName: "", linkAddress: "" }],
});
