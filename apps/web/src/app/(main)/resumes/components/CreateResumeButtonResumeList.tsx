"use client";

import CreateResumeButton from "../../components/CreateResumeButton";
import { Button } from "@/components/ui/button";

const CreateResumeButtonResumeList = () => {
  return (
    <CreateResumeButton
      withRedirect
      button={(onClick, isDisabled) => (
        <Button
          onClick={onClick}
          disabled={isDisabled}
          variant="secondary"
          size="lg"
          className="cursor-pointer"
        >
          Create Resume
        </Button>
      )}
    />
  );
};

export default CreateResumeButtonResumeList;
