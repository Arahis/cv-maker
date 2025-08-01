"use client";

import { Button } from "@/components/ui/button";
import { defaultFormValues } from "@/lib/formUtils";
import { saveFormData } from "@/lib/indexedDB";
import { useRouter } from "next/navigation";
import React from "react";

const CreateResumeButton = () => {
  const router = useRouter();

  const handleCreateResume = () => {
    const resumeId = crypto.randomUUID();

    saveFormData(resumeId, {
      createdAt: new Date(),
      content: defaultFormValues,
    });

    router.push(`/resume-editor/${resumeId}`);
  };

  return <Button onClick={handleCreateResume}>Create Resume</Button>;
};

export default CreateResumeButton;
