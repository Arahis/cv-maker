import { isValid } from "date-fns";
import { CreateResumeBody } from "../../resumes/resume.schema.js";
import { ImportedResume } from "../pars.schema.js";
import { EMPTY_LEXICAL_STATE, plainTextToLexicalState } from "./lexical.js";

function normalizeImportedDate(value: string): string {
  const dateValue = value.trim();

  if (/^\d{4}$/.test(dateValue)) {
    return `${dateValue}-01-01`;
  }

  const date = new Date(dateValue);

  if (!isValid(date)) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function mapImportedResumeToCreateBody(
  imported: ImportedResume,
): CreateResumeBody {
  return {
    data: {
      title: "My resume",
      description: "",

      firstName: imported.firstName,
      lastName: imported.lastName,
      jobTitle: imported.jobTitle,
      city: imported.city,
      country: imported.country,
      phone: imported.phone,
      email: imported.email,

      workExperiences:
        imported.workExperiences.length > 0
          ? imported.workExperiences.map((experience) => ({
              id: crypto.randomUUID(),
              position: experience.position,
              company: experience.company,
              city: experience.city,
              startDate: normalizeImportedDate(experience.startDate),
              endDate: normalizeImportedDate(experience.endDate),
              description: plainTextToLexicalState(experience.description),
              isFullDate: false,
            }))
          : [
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

      educations:
        imported.educations.length > 0
          ? imported.educations.map((education) => ({
              id: crypto.randomUUID(),
              degree: education.degree,
              institution: education.institution,
              startDate: normalizeImportedDate(education.startDate),
              endDate: normalizeImportedDate(education.endDate),
              city: education.city,
              isFullDate: false,
            }))
          : [
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

      languages:
        imported.languages.length > 0
          ? imported.languages.map((language) => ({
              id: crypto.randomUUID(),
              languageName: language.languageName,
              languageLevel: language.languageLevel,
            }))
          : [
              {
                id: crypto.randomUUID(),
                languageName: "",
                languageLevel: "",
              },
            ],

      skills: {
        technical: imported.skills.technical.map((name) => ({
          id: crypto.randomUUID(),
          name,
        })),
        personal: imported.skills.personal.map((name) => ({
          id: crypto.randomUUID(),
          name,
        })),
      },
      summary: plainTextToLexicalState(imported.summary),

      customSections:
        imported.customSections.length > 0
          ? imported.customSections.map((section) => ({
              id: crypto.randomUUID(),
              sectionName: section.sectionName,
              sectionItems:
                section.sectionItems.length > 0
                  ? section.sectionItems.map((item) => ({
                      id: crypto.randomUUID(),
                      title: item.title,
                      value: item.value,
                    }))
                  : [
                      {
                        id: crypto.randomUUID(),
                        title: "",
                        value: "",
                      },
                    ],
            }))
          : [
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

      socialLinks:
        imported.socialLinks.length > 0
          ? imported.socialLinks.map((link) => ({
              id: crypto.randomUUID(),
              linkName: link.linkName,
              linkAddress: link.linkAddress,
            }))
          : [
              {
                id: crypto.randomUUID(),
                linkName: "",
                linkAddress: "",
              },
            ],
    },

    template: "template1",
    media: {},
  };
}
