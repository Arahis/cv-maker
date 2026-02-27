"use client";

import { useEffect, useRef, useState } from "react";
import ResumeEditor from "./ResumeEditor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/lib/validation";
import { Form } from "@/components/ui/form";
import { notFound } from "next/navigation";
import { loadResume } from "@/lib/indexedDB";
import { ResumeTemplateKey } from "@/components/templates/components";
import ResumePreviewWrapper from "./ResumePreviewWrapper";
import { useReactToPrint } from "react-to-print";
import { trackEvent } from "@/components/analytics/events";
import { isDesktopLike } from "@/lib/utils";

const useResumeForm = () =>
  useForm({
    resolver: zodResolver(resumeSchema),
    shouldUnregister: false,
    mode: "onBlur",
    // defaultValues,
  });

const ResumeApp = ({ resumeId }: { resumeId: string | null }) => {
  const [valid, setValid] = useState<null | boolean>(null);
  const [resumeTemplate, setResumeTemplate] = useState<ResumeTemplateKey>();
  const f = useResumeForm();

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
  });

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

  const handlePrintClick = () => {
    const device = isDesktopLike() ? "web" : "touch";
    trackEvent("print_click", { device, resumeTemplate });
    if (isDesktopLike()) {
      reactToPrintFn();
      return;
    }
    const url = `/print?id=${encodeURIComponent(resumeId)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex h-full min-h-0 w-full">
      <Form {...f}>
        <div className="w-full overflow-y-auto border-r md:w-1/2">
          <ResumeEditor resumeId={resumeId} onPrintClick={handlePrintClick} />
        </div>

        <ResumePreviewWrapper
          resumeId={resumeId}
          resumeTemplate={resumeTemplate}
          setResumeTemplate={setResumeTemplate}
          onPrintClick={handlePrintClick}
          ref={contentRef}
        />
      </Form>
    </div>
  );
};

export default ResumeApp;
