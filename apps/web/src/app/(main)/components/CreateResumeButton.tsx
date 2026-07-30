"use client";

import { JSX, useState } from "react";
import { TemplateKey } from "@/components/templates/previews";
import { useCreateResumeController } from "../hooks/useCreateResumeController";
import { ApiError } from "@/api/api-fetch";
import { GuestResumeQuotaDialog } from "./GuestResumeQuotaDialog";
import { FullscreenLoading } from "./FullscreenLoading";
import { useResumeAction } from "../providers/ResumeActionProvider";

const CreateResumeButton = ({
  button,
  template = "template1",
}: {
  button: (onClick: () => void, isDisabled: boolean) => JSX.Element;
  template?: TemplateKey;
}) => {
  const { createResume, isLoading, isProcessing } = useCreateResumeController();
  const { isResumeActionPending, setIsResumeActionPending } = useResumeAction();
  const [isQuotaDialogOpen, setIsQuotaDialogOpen] = useState(false);

  const handleCreateResume = async () => {
    if (isLoading || isResumeActionPending) return;

    setIsResumeActionPending(true);

    try {
      await createResume(template);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setIsQuotaDialogOpen(true);
        return;
      }

      alert("Error while creating resume. Please try again.");
    } finally {
      setIsResumeActionPending(false);
    }
  };

  return (
    <>
      {button(handleCreateResume, isLoading || isResumeActionPending)}
      <GuestResumeQuotaDialog
        open={isQuotaDialogOpen}
        onOpenChange={setIsQuotaDialogOpen}
      />
      {isProcessing && <FullscreenLoading />}
    </>
  );
};

export default CreateResumeButton;
