"use client";

import { trackEvent } from "@/components/analytics/events";
import { Button } from "@/components/ui/button";
import UploadResumeButton from "./UploadResumeButton";

const UploadResumeButtonHero = () => {
  const handleClick = (onClick: () => void) => {
    trackEvent("upload_resume_click", {
      location: "Home_page",
      var: "default",
    });
    onClick();
  };

  return (
    <UploadResumeButton
      withRedirect
      button={(onClick, isDisabled) => (
        <Button
          onClick={() => handleClick(onClick)}
          disabled={isDisabled}
          variant="outline"
          size="lg"
          className="cursor-pointer py-6 text-xl font-semibold"
        >
          Upload & Parse Existing CV
        </Button>
      )}
    />
  );
};

export default UploadResumeButtonHero;
