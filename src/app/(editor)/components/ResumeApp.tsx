"use client";

import { useEffect, useRef, useState } from "react";
import ResumeEditor from "./ResumeEditor";
import ResumePreview from "./ResumePreview";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/lib/validation";
import { Form } from "@/components/ui/form";
import { notFound } from "next/navigation";
import { loadResume, saveResumeVariant } from "@/lib/indexedDB";
import Toolbar from "./toolbar";
import { useReactToPrint } from "react-to-print";
import { ResumeVariantKey, resumeVariants } from "@/components/resume/variants";

const useResumeForm = () =>
  useForm({
    resolver: zodResolver(resumeSchema),
    // defaultValues,
  });

const ResumePreviewWrapper = ({
  resumeId,
  resumeVariant,
}: {
  resumeId: string;
  resumeVariant: ResumeVariantKey | undefined;
}) => {
  const [resumeVar, setResumeVar] = useState<ResumeVariantKey | undefined>(
    resumeVariant,
  );
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
  });
  const onResumeVarChange = async (newVar: ResumeVariantKey) => {
    setResumeVar(newVar);
    try {
      await saveResumeVariant(resumeId, newVar);
    } catch (e) {
      console.error("Failed to save resume variant", e);
    }
  };

  if (!resumeVar) return <p>Loading preview...</p>;

  return (
    <>
      <Toolbar
        onPrintClick={reactToPrintFn}
        onResumeVarChange={onResumeVarChange}
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

const ResumeApp = ({ resumeId }: { resumeId: string | null }) => {
  const [valid, setValid] = useState<null | boolean>(null);
  const [resumeVariant, setResumeVariant] = useState<ResumeVariantKey>();
  const f = useResumeForm();

  // Check if the resume exists in IndexedDB
  // If it exists, load the data into the form
  // If it doesn't exist, show a not found page
  useEffect(() => {
    const checkResumeExists = async () => {
      if (!resumeId) return;

      const resume = await loadResume(resumeId);
      if (resume) {
        f.reset(resume.data);
        setResumeVariant(resume.variant);
      }
      setValid(!!resume);
    };

    checkResumeExists();
  }, [resumeId, f]);

  if (valid === null) return <p>Loading...</p>;
  if (!valid || !resumeId) return notFound();

  return (
    <div className="flex h-full min-h-0 w-full">
      <Form {...f}>
        <div className="w-full overflow-y-auto border-r md:w-1/2">
          <ResumeEditor resumeId={resumeId} />
        </div>
        <div className="relative hidden w-1/2 overflow-y-auto md:flex">
          <ResumePreviewWrapper
            resumeId={resumeId}
            resumeVariant={resumeVariant}
          />
        </div>
      </Form>
    </div>
  );
};

export default ResumeApp;
