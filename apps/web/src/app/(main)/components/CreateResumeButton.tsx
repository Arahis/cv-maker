"use client";

import { JSX, useState } from "react";
import { TemplateKey } from "@/components/templates/previews";
import { useCreateResumeController } from "../hooks/useCreateResumeController";
import { ApiError } from "@/api/api-fetch";
import { GuestResumeQuotaDialog } from "./GuestResumeQuotaDialog";
import { ErrorDialog } from "./ErrorDialog";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

      setErrorMessage("Error while creating resume. Please try again.");
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
      <ErrorDialog
        open={Boolean(errorMessage)}
        onOpenChange={(open) => {
          if (!open) setErrorMessage(null);
        }}
        message={errorMessage ?? ""}
      />
      {isProcessing && <FullscreenLoading />}
    </>
  );
};

export default CreateResumeButton;
