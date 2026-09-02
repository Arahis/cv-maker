import type { ResumeForm } from "@/lib/validation";

const lexicalText = (...paragraphs: string[]) =>
  JSON.stringify({
    root: {
      type: "root",
      version: 1,
      children: paragraphs.map((text) => ({
        type: "paragraph",
        version: 1,
        direction: "ltr",
        format: "",
        indent: 0,
        children: [
          {
            type: "text",
            version: 1,
            text,
            format: 0,
            detail: 0,
            mode: "normal",
            style: "",
          },
        ],
      })),
    },
  });

export const resumeMock: ResumeForm = {
  title: "Helga Dionis — Software Test Engineer",
  description: "",
  firstName: "Helga",
  lastName: "Dionis",
  jobTitle: "Software Test Engineer",
  city: "Amsterdam",
  country: "Netherlands",
  phone: "+61 009 009 009",
  email: "hello.helga@gmail.com",
  workExperiences: [
    {
      id: "helga-work-cloudbridge",
      position: "QA Engineer",
      company: "CloudBridge Systems",
      city: "",
      startDate: "2022-09",
      endDate: "",
      isFullDate: false,
      description: lexicalText(
        "Lead quality assurance for a SaaS customer-support platform used by distributed sales and service teams. Define test strategy for new releases, review product requirements, and coordinate testing across web and API layers.",
        "Created and maintained automated regression suites using Playwright and TypeScript, reducing manual regression time by 45%. Introduced reusable test fixtures and improved test stability in CI environments.",
        "Collaborate with developers, designers, and product managers during planning and refinement sessions. Identify edge cases early, document acceptance criteria, and support production release decisions.",
        "Investigate customer-reported issues using browser logs, network requests, and monitoring tools. Prepare detailed bug reports with reproduction steps, expected behavior, technical evidence, and severity assessment.",
        "Mentor junior QA engineers, review test cases, and maintain internal documentation for testing workflows and release procedures.",
      ),
    },
    {
      id: "helga-work-intelligent-contacts",
      position: "QA Engineer",
      company: "Intelligent Contacts",
      city: "",
      startDate: "2019-09",
      endDate: "2022-08",
      isFullDate: false,
      description: lexicalText(
        "Performed functional, integration, regression, and exploratory testing for a cloud contact-center solution. Tested complex user flows involving calls, customer profiles, automation rules, permissions, and billing settings.",
        "Designed test plans for new features and maintained regression checklists for weekly releases. Worked closely with backend engineers to validate REST API responses, error handling, and data consistency.",
        "Expanded automated UI coverage with Selenium and Java. Added API tests with Postman and Newman and integrated them into the CI pipeline.",
        "Participated in incident reviews and helped identify recurring causes of production defects.",
      ),
    },
  ],
  educations: [
    {
      id: "helga-education-ams",
      degree: "BSc in Computer Science",
      institution: "Amsterdam University of Applied Sciences",
      startDate: "2017",
      endDate: "2021",
      city: "",
      isFullDate: false,
    },
  ],
  skills: {
    technical: [
      "Functional Testing",
      "Regression Testing",
      "Exploratory Testing",
      "API Testing",
      "Integration Testing",
      "Cross-Browser Testing",
      "Mobile Web Testing",
      "Accessibility Testing",
      "Release Validation",
      "Defect Management",
    ].map((name, index) => ({ id: `helga-skill-${index + 1}`, name })),
    personal: [],
  },
  languages: [
    {
      id: "helga-language-english",
      languageName: "English",
      languageLevel: "Professional proficiency",
    },
    {
      id: "helga-language-dutch",
      languageName: "Dutch",
      languageLevel: "Intermediate",
    },
  ],
  summary: "",
  customSections: [
    {
      id: "helga-certifications",
      sectionName: "Certifications",
      sectionItems: [
        {
          id: "helga-certification-istqb",
          title: "ISTQB Certified Tester",
          value: "Foundation Level — 2021",
        },
        {
          id: "helga-certification-psm",
          title: "Professional Scrum Master I",
          value: "2016",
        },
      ],
    },
    {
      id: "helga-education-focus",
      sectionName: "Education Focus",
      sectionItems: [
        {
          id: "helga-education-focus-value",
          title: "Focus",
          value:
            "Software engineering, databases, web development, and information systems.",
        },
      ],
    },
  ],
  socialLinks: [],
};
