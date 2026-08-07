"use client";

import { type ChangeEvent, type JSX, useRef, useState } from "react";
import { useCreateResumeController } from "../hooks/useCreateResumeController";
import { ApiError } from "@/api/api-fetch";
import { GuestResumeQuotaDialog } from "./GuestResumeQuotaDialog";
import { PdfParseLimitDialog } from "./PdfParseLimitDialog";
import { FileSizeLimitDialog } from "./FileSizeLimitDialog";
import { ErrorDialog } from "./ErrorDialog";
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
  withRedirect = false,
}: {
  button: (onClick: () => void, isDisabled: boolean) => JSX.Element;
  withRedirect?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isQuotaDialogOpen, setIsQuotaDialogOpen] = useState(false);
  const [hasEverUploaded, setHasEverUploaded] = useState(false);
  const [isPdfLimitDialogOpen, setIsPdfLimitDialogOpen] = useState(false);
  const [isFileSizeDialogOpen, setIsFileSizeDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    checkGuestResumeQuota,
    checkPdfParseLimit,
    createResumeFromUploaded,
    hasGuestLocalResumes,
    isLoading,
    isProcessing,
  } = useCreateResumeController();
  const { isResumeActionPending, setIsResumeActionPending } = useResumeAction();

  const handleButtonClick = async () => {
    if (isLoading || isResumeActionPending) return;

    setIsResumeActionPending(true);

    try {
      const hasUploaded = await checkGuestResumeQuota();
      setHasEverUploaded(hasUploaded);

      if (withRedirect && hasGuestLocalResumes()) {
        setIsQuotaDialogOpen(true);
        return;
      }

      if (hasUploaded) {
        setIsQuotaDialogOpen(true);
        return;
      }

      await checkPdfParseLimit();

      inputRef.current?.click();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setIsQuotaDialogOpen(true);
        return;
      }

      if (error instanceof ApiError && error.status === 429) {
        setIsPdfLimitDialogOpen(true);
        return;
      }

      setErrorMessage(
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
      setIsFileSizeDialogOpen(true);
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

      if (error instanceof ApiError && error.status === 429) {
        setIsPdfLimitDialogOpen(true);
        return;
      }

      setErrorMessage(getErrorMessage(error, "Error while creating resume."));
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
        source="upload"
        hasEverUploaded={hasEverUploaded}
      />
      <PdfParseLimitDialog
        open={isPdfLimitDialogOpen}
        onOpenChange={setIsPdfLimitDialogOpen}
      />
      <FileSizeLimitDialog
        open={isFileSizeDialogOpen}
        onOpenChange={setIsFileSizeDialogOpen}
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

export default UploadResumeButton;
