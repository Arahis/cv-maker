"use client";

import React, { ReactNode, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFormContext } from "react-hook-form";

import PersonalInfo from "./components/forms/PersonalInfo";
import ResumeDescription from "./components/forms/ResumeDescription";
import WorkExperience from "./components/forms/WorkExperience";
import Education from "./components/forms/Education";
import Skills from "./components/forms/Skills";
import Summary from "./components/forms/Summary";
import ResumeSteps from "./components/CreateResumeSteps";
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

// Use in case we need to remember the number of step from URL params
const useWithParamsNavigation = () => {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") || resumeSections[0].slug;
  const setStep = (slug: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", slug);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  };
  return { currentStep, setStep };
};

const ResumeEditor = ({ resumeId }: { resumeId: string }) => {
  const f = useFormContext();
  const [currentEditorStep, setCurrentEditorStep] = useState(0);
  const sectionTitles = resumeSections.map((section) => section.title);

  // ✅ Автосохранение в IndexedDB
  useIndexedDBDebouncedSave(f.control, resumeId, 2000);

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
