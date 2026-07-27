"use client";

import { type ChangeEvent, type JSX, useRef } from "react";
import { useCreateResumeController } from "../resumes/useCreateResumeController";

const UploadResumeButton = ({
  button,
}: {
  button: (onClick: () => void, isDisabled: boolean) => JSX.Element;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { createResumeFromUploaded, isUploadedLoading } =
    useCreateResumeController();

  const handleButtonClick = () => {
    if (!isUploadedLoading) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Allow selecting the same file again after an error or a retry.
    event.target.value = "";

    if (!file || isUploadedLoading) return;

    try {
      await createResumeFromUploaded(file);
    } catch {
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
    </>
  );
};

export default UploadResumeButton;
