"use client";

import { JSX, useState } from "react";
import { TemplateKey } from "@/components/templates/previews";
import { useCreateResumeController } from "../resumes/useCreateResumeController";
import { ApiError } from "@/api/api-fetch";
import { GuestResumeQuotaDialog } from "./GuestResumeQuotaDialog";

const CreateResumeButton = ({
  button,
  template = "template1",
}: {
  button: (onClick: () => void, isDisabled: boolean) => JSX.Element;
  template?: TemplateKey;
}) => {
  const { createResume, isLoading } = useCreateResumeController();
  const [isQuotaDialogOpen, setIsQuotaDialogOpen] = useState(false);

  const handleCreateResume = async () => {
    if (isLoading) return;

    try {
      await createResume(template);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setIsQuotaDialogOpen(true);
        return;
      }

      alert("Error while creating resume. Please try again.");
    }
  };

  return (
    <>
      {button(handleCreateResume, isLoading)}
      <GuestResumeQuotaDialog
        open={isQuotaDialogOpen}
        onOpenChange={setIsQuotaDialogOpen}
      />
    </>
  );
};

export default CreateResumeButton;
