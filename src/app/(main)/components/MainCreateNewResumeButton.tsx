"use client";

import { trackEvent } from "@/components/analytics/events";
import CreateResumeButton from "./CreateResumeButton";
import { Button } from "@/components/ui/button";

const MainCreateNewResumeButton = () => {
  const handleClick = (onClick: () => void) => {
    trackEvent("create_resume_click", {
      location: "Home_page",
      var: "default",
    });
    onClick();
  };

  return (
    <CreateResumeButton
      button={(onClick, isDisabled) => (
        <Button
          onClick={() => handleClick(onClick)}
          disabled={isDisabled}
          variant="default"
          size="lg"
          className="cursor-pointer font-semibold"
        >
          {"Try it Now!".toUpperCase()}
        </Button>
      )}
    />
  );
};

export default MainCreateNewResumeButton;
