"use client";

import React, { ReactNode, useState } from "react";
import { useFormContext } from "react-hook-form";

import PersonalInfo from "./forms/PersonalInfo";
import ResumeDescription from "./forms/ResumeDescription";
import WorkExperience from "./forms/WorkExperience";
import Education from "./forms/Education";
import Skills from "./forms/Skills";
import Summary from "./forms/Summary";
import ResumeSteps from "./CreateResumeSteps";
import { useIndexedDBDebouncedSave } from "@/lib/indexedDB";

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
  const f = useFormContext();
  const [currentEditorStep, setCurrentEditorStep] = useState(0);
  const sectionTitles = resumeSections.map((section) => section.title);

  // Autosave в IndexedDB with debounce
  useIndexedDBDebouncedSave(f.control, resumeId, 3000);

  return (
    <form onSubmit={f.handleSubmit((data) => console.log(data))}>
      <ResumeSteps
        items={sectionTitles}
        currentStep={currentEditorStep}
        setItem={setCurrentEditorStep}
      />
      {resumeSections[currentEditorStep].item}
    </form>
  );
};

export default ResumeEditor;
