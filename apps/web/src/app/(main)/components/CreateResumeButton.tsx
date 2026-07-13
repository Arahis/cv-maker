"use client";

import { JSX } from "react";
import { TemplateKey } from "@/components/templates/previews";
import { useCreateResumeController } from "../resumes/useCreateResumeController";

const CreateResumeButton = ({
  button,
  template = "template1",
}: {
  button: (onClick: () => void, isDisabled: boolean) => JSX.Element;
  template?: TemplateKey;
}) => {
  const { createResume, isLoading } = useCreateResumeController();

  const handleCreateResume = async () => {
    if (isLoading) return;

    try {
      await createResume(template);
    } catch {
      alert("Error while creating resume. Please try again.");
    }
  };

  return button(handleCreateResume, isLoading);
};

export default CreateResumeButton;
