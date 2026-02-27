"use client";

import { useState, JSX } from "react";
import { defaultFormValues } from "@/lib/formDefaults";
import { createResume } from "@/lib/indexedDB";
import { useRouter } from "next/navigation";
import { TemplateKey } from "@/components/templates/previews";

const CreateResumeButton = ({
  button,
  template = "template1",
}: {
  button: (onClick: () => void, isDisabled: boolean) => JSX.Element;
  template?: TemplateKey;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateResume = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const resumeId = crypto.randomUUID();

    try {
      await createResume(resumeId, defaultFormValues, template);
      router.push(`/resume-editor?id=${encodeURIComponent(resumeId)}`);
    } catch {
      alert("Error while creating resume. Please try again.");
      setIsLoading(false);
    }
  };

  return button(handleCreateResume, isLoading);
};

export default CreateResumeButton;
