"use client";

import { ReactNode, useState } from "react";
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
import { Button } from "@/components/ui/button";

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
}: ResumeStepsControlProps) => (
  <div className="mb-6">
    <ResumeSteps
      items={titles}
      currentStep={currentStep}
      setItem={setStep}
      className="mb-4"
    />
    <div className="flex justify-between">
      <Button
        variant="secondary"
        onClick={setPrevStep}
        disabled={currentStep === 0}
      >
        Prev Step
      </Button>
      <Button
        variant="secondary"
        onClick={setNextStep}
        disabled={currentStep === titles.length - 1}
      >
        Next Step
      </Button>
    </div>
  </div>
);

const ResumeEditor = ({ resumeId }: { resumeId: string }) => {
  const f = useFormContext<ResumeForm>();
  const formData = useWatch({ control: f.control });
  const [currentEditorStep, setCurrentEditorStep] = useState(0);
  const sectionTitles = resumeSections.map((section) => section.title);

  const handleGoToNextItem = () => {
    setCurrentEditorStep((prev) =>
      Math.min(prev + 1, sectionTitles.length - 1),
    );
  };

  const handleGoToPrevItem = () => {
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
          {resumeSections[currentEditorStep].item}
        </div>
      </ResumeEditorProvider>
    </div>
  );
};

export default ResumeEditor;
