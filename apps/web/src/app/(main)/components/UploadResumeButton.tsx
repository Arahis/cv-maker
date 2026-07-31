"use client";

import { type ChangeEvent, type JSX, useRef, useState } from "react";
import { useCreateResumeController } from "../hooks/useCreateResumeController";
import { ApiError } from "@/api/api-fetch";
import { GuestResumeQuotaDialog } from "./GuestResumeQuotaDialog";
import { FullscreenLoading } from "./FullscreenLoading";
import { useResumeAction } from "../providers/ResumeActionProvider";

const MAX_RESUME_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    try {
      const body = JSON.parse(error.message) as {
        message?: string;
        error?: string;
      };
      const message = body.message ?? body.error;

      if (message) {
        return `${message} (HTTP ${error.status})`;
      }
    } catch {
      // The API may return a non-JSON error body.
    }

    return `${fallback} (HTTP ${error.status})`;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

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
    isLoading,
    isProcessing,
  } = useCreateResumeController();
  const { isResumeActionPending, setIsResumeActionPending } = useResumeAction();

  const handleButtonClick = async () => {
    if (isLoading || isResumeActionPending) return;

    setIsResumeActionPending(true);

    try {
      const canChooseFile = await checkGuestResumeQuota(true);

      if (!canChooseFile) {
        return;
      }

      inputRef.current?.click();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setIsQuotaDialogOpen(true);
        return;
      }

      alert(
        getErrorMessage(
          error,
          "Error while checking the resume limit. Please try again.",
        ),
      );
    } finally {
      setIsResumeActionPending(false);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Allow selecting the same file again after an error or a retry.
    event.target.value = "";

    if (!file || isLoading || isResumeActionPending) return;

    if (file.size > MAX_RESUME_FILE_SIZE_BYTES) {
      alert("File is too large. The maximum allowed size is 5 MB.");
      return;
    }

    setIsResumeActionPending(true);

    try {
      await createResumeFromUploaded(file);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setIsQuotaDialogOpen(true);
        return;
      }

      alert(
        getErrorMessage(error, "Error while creating resume."),
      );
    } finally {
      setIsResumeActionPending(false);
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
      {button(handleButtonClick, isLoading || isResumeActionPending)}
      <GuestResumeQuotaDialog
        open={isQuotaDialogOpen}
        onOpenChange={setIsQuotaDialogOpen}
      />
      {isProcessing && <FullscreenLoading />}
    </>
  );
};

export default UploadResumeButton;
