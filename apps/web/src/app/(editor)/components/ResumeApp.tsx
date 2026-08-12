"use client";

import { useEffect, useRef, useState } from "react";
import ResumeForm from "./ResumeForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/lib/validation";
import { Form } from "@/components/ui/form";
import { notFound, useRouter } from "next/navigation";
import { ResumeTemplateKey } from "@/components/templates/components";
import ResumePreviewWrapper from "./ResumePreviewWrapper";
import { trackEvent } from "@/components/analytics/events";
import { isDesktopLike } from "@/lib/utils";
import { useReactToPrint } from "react-to-print";
import Loading from "@/components/Loading";
import { useResumeEditorController } from "../useResumeEditorController";
import { defaultFormValues } from "@/lib/formDefaults";
import { useResumePersistenceController } from "../useResumePersistenceController";
import useAvatar from "../store/hooks/useAvatar";
import { generateAccountResumePdf } from "@/api/pdf";

const useResumeForm = () =>
  useForm({
    resolver: zodResolver(resumeSchema),
    shouldUnregister: false,
    mode: "onBlur",
    defaultValues: defaultFormValues(),
  });

const downloadPdf = async (resumeId: string) => {
  const blob = await generateAccountResumePdf(resumeId);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "resume.pdf";
  link.click();
  URL.revokeObjectURL(url);
};

const ResumeApp = ({ resumeId }: { resumeId: string | null }) => {
  if (!resumeId) return notFound();
  return <ResumeAppInner resumeId={resumeId} />;
};

const ResumeAppInner = ({ resumeId }: { resumeId: string }) => {
  const { status, resume, source } = useResumeEditorController(resumeId);
  const { saveTemplate } = useResumePersistenceController({
    resumeId,
    source,
  });

  const [resumeTemplate, setResumeTemplate] = useState<ResumeTemplateKey>();
  const f = useResumeForm();
  const router = useRouter();
  const { setAvatarState } = useAvatar();

  const contentRef = useRef<HTMLDivElement>(null);

  const onResumeTemplateChange = async (newVar: ResumeTemplateKey) => {
    setResumeTemplate(newVar);
    try {
      await saveTemplate(newVar);
    } catch (e) {
      console.error("Failed to save resume variant", e);
    }
  };

  const reactToPrintFn = useReactToPrint({
    contentRef,
  });

  useEffect(() => {
    if (resume) {
      f.reset(resume.data);
      setResumeTemplate(resume.template);
      setAvatarState(resume.media?.avatar);
    }
  }, [resumeId, f, resume?.data, resume?.template, resume?.media, setAvatarState]);

  useEffect(() => {
    if (status === "forbidden") {
      router.replace("/resumes");
    }
  }, [status, router]);

  if (status === "not_found") return notFound();
  if (status === "loading" || status === "forbidden") return <Loading />;

  const handlePrintClick = async () => {
    const device = isDesktopLike() ? "web" : "touch";
    trackEvent("print_click", { device, var: resumeTemplate });

    if (source === "account") {
      try {
        await downloadPdf(resumeId);
      } catch (error) {
        console.error("Failed to generate PDF", error);
      }

      return;
    }

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
          <ResumeForm
            resumeId={resumeId}
            onPrintClick={handlePrintClick}
            source={source}
          />
        </div>

        <ResumePreviewWrapper
          resumeId={resumeId}
          resumeTemplate={resumeTemplate}
          onResumeTemplateChange={onResumeTemplateChange}
          onPrintClick={handlePrintClick}
          ref={contentRef}
        />
      </Form>
    </div>
  );
};

export default ResumeApp;
