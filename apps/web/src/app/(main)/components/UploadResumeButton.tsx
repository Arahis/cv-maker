"use client";

import { type ChangeEvent, type JSX, useRef, useState } from "react";
import { useCreateResumeController } from "../resumes/useCreateResumeController";
import { ApiError } from "@/api/api-fetch";
import { GuestResumeQuotaDialog } from "./GuestResumeQuotaDialog";

const UploadResumeButton = ({
  button,
}: {
  button: (onClick: () => void, isDisabled: boolean) => JSX.Element;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isQuotaDialogOpen, setIsQuotaDialogOpen] = useState(false);
  const {
    checkGuestResumeQuota,
    createResumeFromUploaded,
    isUploadedLoading,
  } =
    useCreateResumeController();

  const handleButtonClick = async () => {
    if (isUploadedLoading) return;

    try {
      await checkGuestResumeQuota();
      inputRef.current?.click();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setIsQuotaDialogOpen(true);
        return;
      }

      alert("Error while checking the resume limit. Please try again.");
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Allow selecting the same file again after an error or a retry.
    event.target.value = "";

    if (!file || isUploadedLoading) return;

    try {
      await createResumeFromUploaded(file);
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
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      {button(handleButtonClick, isUploadedLoading)}
      <GuestResumeQuotaDialog
        open={isQuotaDialogOpen}
        onOpenChange={setIsQuotaDialogOpen}
      />
    </>
  );
};

export default UploadResumeButton;
