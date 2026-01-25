"use client";

import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import ResumeEditor from "./ResumeEditor";
import ResumePreview from "./ResumePreview";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResumeForm, resumeSchema } from "@/lib/validation";
import { Form } from "@/components/ui/form";
import { notFound } from "next/navigation";
import { loadResume } from "@/lib/indexedDB";
import Toolbar from "./toolbar";
import { useReactToPrint } from "react-to-print";
import { ResumeVariant1 } from "./ResumePreview/resume-variants/variant1";
import { ResumeVariant2 } from "./ResumePreview/resume-variants/variant2";

export type ResumeVariantProps = {
  data: ResumeForm;
  photo: string | null;
};

type ResumeVariantComponent = React.ForwardRefExoticComponent<
  ResumeVariantProps & React.RefAttributes<HTMLDivElement>
>;

export const resumeVariants = {
  variant1: ResumeVariant1,
  variant2: ResumeVariant2,
} satisfies Record<string, ResumeVariantComponent>;

export type ResumeVariantKey = keyof typeof resumeVariants;

const useResumeForm = () =>
  useForm({
    resolver: zodResolver(resumeSchema),
    // defaultValues,
  });

const ResumePreviewWrapper = ({ resumeId }: { resumeId: string }) => {
  const [resumeVar, setResumeVar] = useState<ResumeVariantKey>("variant2");
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <>
      <Toolbar
        onPrintClick={reactToPrintFn}
        onResumeVarChange={setResumeVar}
        resumeVariants={resumeVariants}
        variant={resumeVar}
      />
      <ResumePreview
        key={resumeVar}
        resumeId={resumeId}
        ref={contentRef}
        resumeComponent={resumeVariants[resumeVar]}
      />
    </>
  );
};

const ResumeApp = ({ resumeId }: { resumeId: string }) => {
  const [valid, setValid] = useState<null | boolean>(null);
  const f = useResumeForm();

  // Check if the resume exists in IndexedDB
  // If it exists, load the data into the form
  // If it doesn't exist, show a not found page
  useEffect(() => {
    const checkResumeExists = async () => {
      const resume = await loadResume(resumeId);
      if (!!resume) {
        f.reset(resume.data);
      }
      setValid(!!resume);
    };

    checkResumeExists();
  }, [resumeId, f]);

  if (valid === null) return <p>Загрузка...</p>;
  if (!valid) return notFound();

  return (
    <div className="flex h-screen w-full">
      <Form {...f}>
        <div className="w-full overflow-y-auto border-r md:w-1/2">
          <ResumeEditor resumeId={resumeId} />
        </div>
        <div className="relative hidden h-screen w-1/2 overflow-y-auto md:flex">
          <ResumePreviewWrapper resumeId={resumeId} />
        </div>
      </Form>
    </div>
  );
};

export default ResumeApp;
