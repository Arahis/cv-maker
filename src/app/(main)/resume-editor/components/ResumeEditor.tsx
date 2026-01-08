"use client";

import React, { ReactNode, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import PersonalInfo from "./forms/personalInfo";
import ResumeDescription from "./forms/ResumeDescription";
import WorkExperience from "./forms/WorkExperience";
import Education from "./forms/Education";
import Skills from "./forms/skills";
import Summary from "./forms/Summary";
import ResumeSteps from "./CreateResumeSteps";
import { useIndexedDBDebouncedSave } from "@/lib/indexedDB";
import { ResumeEditorProvider } from "../context/ResumeEditorContext";
import { ResumeForm } from "@/lib/validation";

const resumeSections: {
  title: string;
  slug: string;
  item: ReactNode;
}[] = [
  {
    title: "Resume description",
    slug: "description",
    item: <ResumeDescription />,
  },
  {
    title: "Personal information",
    slug: "personal-info",
    item: <PersonalInfo />,
  },
  {
    title: "Work experience",
    slug: "work-experience",
    item: <WorkExperience />,
  },
  {
    title: "Education",
    slug: "education",
    item: <Education />,
  },
  {
    title: "Skills",
    slug: "skills",
    item: <Skills />,
  },
  {
    title: "Summary",
    slug: "summary",
    item: <Summary />,
  },
];

const ResumeEditor = ({ resumeId }: { resumeId: string }) => {
  const f = useFormContext<ResumeForm>();
  const formData = useWatch({ control: f.control });
  const [currentEditorStep, setCurrentEditorStep] = useState(0);
  const sectionTitles = resumeSections.map((section) => section.title);

  // Autosave в IndexedDB with debounce
  // @ts-expect-error: useWatch doesn't infer the type of formData correctly
  useIndexedDBDebouncedSave(resumeId, formData, 1000);

  return (
    <form onSubmit={f.handleSubmit((data) => console.log(data))}>
      <ResumeSteps
        items={sectionTitles}
        currentStep={currentEditorStep}
        setItem={setCurrentEditorStep}
      />
      <ResumeEditorProvider value={{ resumeId }}>
        {resumeSections[currentEditorStep].item}
      </ResumeEditorProvider>
    </form>
  );
};

export default ResumeEditor;
