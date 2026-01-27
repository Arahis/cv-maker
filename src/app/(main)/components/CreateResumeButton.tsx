"use client";

import { useState, JSX } from "react";
import { defaultFormValues } from "@/lib/formUtils";
import { createResume } from "@/lib/indexedDB";
import { useRouter } from "next/navigation";

const CreateResumeButton = ({
  button,
}: {
  button: (onClick: () => void, isDisabled: boolean) => JSX.Element;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateResume = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const resumeId = crypto.randomUUID();

    try {
      await createResume(resumeId, defaultFormValues);
      router.push(`/resume-editor?id=${encodeURIComponent(resumeId)}`);
    } catch {
      alert("Error while creating resume. Please try again.");
      setIsLoading(false);
    }
  };

  return button(handleCreateResume, isLoading);
};

export default CreateResumeButton;
