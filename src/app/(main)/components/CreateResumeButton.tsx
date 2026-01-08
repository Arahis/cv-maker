"use client";

import { Button } from "@/components/ui/button";
import { defaultFormValues } from "@/lib/formUtils";
import { createResume } from "@/lib/indexedDB";
import { useRouter } from "next/navigation";
import React from "react";

const CreateResumeButton = () => {
  const router = useRouter();

  const handleCreateResume = async () => {
    const resumeId = crypto.randomUUID();

    try {
      await createResume(resumeId, defaultFormValues);
    } catch {
      alert("Error while creating resume. Please try again.");
      return;
    }

    router.push(`/resume-editor/${resumeId}`);
  };

  return <Button onClick={handleCreateResume}>Create Resume</Button>;
};

export default CreateResumeButton;
