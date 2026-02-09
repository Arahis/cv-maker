"use client";

import { useEffect, useState } from "react";
import ResumeEditor from "./ResumeEditor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/lib/validation";
import { Form } from "@/components/ui/form";
import { notFound } from "next/navigation";
import { loadResume } from "@/lib/indexedDB";
import { ResumeTemplateKey } from "@/components/templates/components";
import ResumePreviewWrapper from "./ResumePreviewWrapper";

const useResumeForm = () =>
  useForm({
    resolver: zodResolver(resumeSchema),
    shouldUnregister: false,
    // defaultValues,
  });

const ResumeApp = ({ resumeId }: { resumeId: string | null }) => {
  const [valid, setValid] = useState<null | boolean>(null);
  const [resumeTemplate, setResumeTemplate] = useState<ResumeTemplateKey>();
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
        setResumeTemplate(resume.template);
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

        <ResumePreviewWrapper
          resumeId={resumeId}
          resumeTemplate={resumeTemplate}
        />
      </Form>
    </div>
  );
};

export default ResumeApp;
