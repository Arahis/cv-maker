"use client";

import { Button } from "@/components/ui/button";
import UploadResumeButton from "../../components/UploadResumeButton";

export default function UploadResumeButtonResumeList() {
  return (
    <UploadResumeButton
      withRedirect
      button={(onClick, isDisabled) => (
        <Button
          onClick={onClick}
          disabled={isDisabled}
          variant="outline"
          size="lg"
          className="cursor-pointer"
        >
          Upload Existing Resume
        </Button>
      )}
    />
  );
}
