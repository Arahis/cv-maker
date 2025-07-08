"use client";

import React, { ReactNode, useState } from "react";
import { useSearchParams } from "next/navigation";

import ResumeSteps from "./createResumeSteps";
import PersonalInfo from "./forms/PersonalInfo";
import ResumeDescription from "./forms/ResumeDescription";
import WorkExperience from "./forms/WorkExperience";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

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

const ResumeEditor = () => {
  const form = useForm();
  const [currentEditorStep, setCurrentEditorStep] = useState(0);
  const sectionTitles = resumeSections.map((section) => section.title);

  return (
    <main className="">
      <div className="flex w-full">
        <div className="w-full md:w-1/2">
          <ResumeSteps
            items={sectionTitles}
            currentStep={currentEditorStep}
            setItem={setCurrentEditorStep}
          />

          {resumeSections[currentEditorStep].item}
        </div>
        <div className="hidden w-1/2 md:flex">Right</div>
      </div>
    </main>
  );
};

export default ResumeEditor;
