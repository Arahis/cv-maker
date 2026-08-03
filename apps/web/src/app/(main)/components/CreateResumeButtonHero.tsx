"use client";

import { trackEvent } from "@/components/analytics/events";
import CreateResumeButton from "./CreateResumeButton";
import { Button } from "@/components/ui/button";

const CreateResumeButtonHero = () => {
  const handleClick = (onClick: () => void) => {
    trackEvent("create_resume_click", {
      location: "Home_page",
      var: "default",
    });
    onClick();
  };

  return (
    <CreateResumeButton
      withRedirect
      button={(onClick, isDisabled) => (
        <Button
          onClick={() => handleClick(onClick)}
          disabled={isDisabled}
          variant="default"
          size="lg"
          className="cursor-pointer py-6 text-xl font-semibold"
        >
          Create From Scratch
        </Button>
      )}
    />
  );
};

export default CreateResumeButtonHero;
