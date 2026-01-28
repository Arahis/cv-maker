"use client";

import CreateResumeButton from "./CreateResumeButton";
import { Button } from "@/components/ui/button";

const MainCreateNewResumeButton = () => {
  return (
    <CreateResumeButton
      button={(onClick, isDisabled) => (
        <Button
          onClick={onClick}
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
