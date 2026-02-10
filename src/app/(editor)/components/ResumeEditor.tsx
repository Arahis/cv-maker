"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import PersonalInfo from "./forms/personalInfo";
import ResumeDescription from "./forms/ResumeDescription";
import WorkExperience from "./forms/WorkExperience";
import Education from "./forms/Education";
import Skills from "./forms/skills";
import Summary from "./forms/Summary";
import ResumeSteps from "./ResumeSteps";
import { useIndexedDBDebouncedSave } from "@/lib/indexedDB";
import { ResumeEditorProvider } from "../context/ResumeEditorContext";
import { ResumeForm } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import OtherInfo from "./forms/OtherInfo";
import { cn } from "@/lib/utils";

const resumeSections: {
  title: string;
  slug: string;
  Component: React.ComponentType<any>;
}[] = [
  {
    title: "Personal information",
    slug: "personal-info",
    Component: PersonalInfo,
  },
  {
    title: "Summary",
    slug: "summary",
    Component: Summary,
  },
  {
    title: "Work experience",
    slug: "work-experience",
    Component: WorkExperience,
  },
  {
    title: "Education",
    slug: "education",
    Component: Education,
  },
  {
    title: "Skills",
    slug: "skills",
    Component: Skills,
  },
  {
    title: "Other Info",
    slug: "other-info",
    Component: OtherInfo,
  },
  {
    title: "Finalize",
    slug: "finalize",
    Component: ResumeDescription,
  },
];

type ResumeStepsControlProps = {
  titles: string[];
  currentStep: number;
  setStep: (item: number) => void;
  setNextStep: () => void;
  setPrevStep: () => void;
};

const ResumeStepsControl = ({
  titles,
  currentStep,
  setStep,
  setNextStep,
  setPrevStep,
}: ResumeStepsControlProps) => {
  const isFinalize = currentStep === titles.length - 2;

  return (
    <div className="mb-6">
      <ResumeSteps
        items={titles}
        currentStep={currentStep}
        setItem={setStep}
        className="mb-4"
      />
      <div className="grid grid-cols-2">
        <div>
          <Button
            variant="secondary"
            onClick={setPrevStep}
            className={cn(currentStep === 0 && "hidden")}
          >
            Prev Step
          </Button>
        </div>
        <div className="flex justify-end">
          <Button
            variant={isFinalize ? "default" : "secondary"}
            onClick={setNextStep}
            className={cn(currentStep === titles.length - 1 && "hidden")}
          >
            {isFinalize ? "Finalize" : "Next Step"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const ResumeEditor = ({
  resumeId,
  onPrintClick,
}: {
  resumeId: string;
  onPrintClick: () => void;
}) => {
  const f = useFormContext<ResumeForm>();
  const formData = useWatch({ control: f.control });
  const [currentEditorStep, setCurrentEditorStep] = useState(0);
  const sectionTitles = resumeSections.map((section) => section.title);

  const { slug, Component } = resumeSections[currentEditorStep];

  const handleGoToNextItem = () => {
    if (currentEditorStep === sectionTitles.length - 1) return;
    setCurrentEditorStep((prev) =>
      Math.min(prev + 1, sectionTitles.length - 1),
    );
  };

  const handleGoToPrevItem = () => {
    if (currentEditorStep === 0) return;
    setCurrentEditorStep((prev) => Math.max(0, prev - 1));
  };

  // Autosave в IndexedDB with debounce
  // @ts-expect-error: useWatch doesn't infer the type of formData correctly
  useIndexedDBDebouncedSave(resumeId, formData, 2000);

  return (
    <div className="mx-4 py-4 md:mx-12">
      <ResumeStepsControl
        titles={sectionTitles}
        currentStep={currentEditorStep}
        setStep={setCurrentEditorStep}
        setNextStep={handleGoToNextItem}
        setPrevStep={handleGoToPrevItem}
      />
      <ResumeEditorProvider value={{ resumeId }}>
        <div className="rounded-2xl border-2 border-gray-100 p-6">
          <Component {...(slug === "finalize" ? { onPrintClick } : {})} />
        </div>
      </ResumeEditorProvider>
    </div>
  );
};

export default ResumeEditor;
