"use client";

import CreateResumeButton from "../components/CreateResumeButton";
import { Button } from "@/components/ui/button";

const CreateNewResumeButton = () => {
  return (
    <CreateResumeButton
      button={(onClick, isDisabled) => (
        <Button
          onClick={onClick}
          disabled={isDisabled}
          variant="secondary"
          size="lg"
          className="cursor-pointer"
        >
          Psss! Create New Resume
        </Button>
      )}
    />
  );
};

export default CreateNewResumeButton;
