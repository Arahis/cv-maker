"use client";

import React, { useEffect, useState } from "react";
import ResumeEditor from "./ResumeEditor";
import ResumePreview from "./ResumePreview";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/lib/validation";
import { Form } from "@/components/ui/form";
import { notFound } from "next/navigation";
import { loadFormData } from "@/lib/indexedDB";

const useResumeForm = () =>
  useForm({
    resolver: zodResolver(resumeSchema),
    // defaultValues,
  });

const ResumeApp = ({ resumeId }: { resumeId: string }) => {
  const [valid, setValid] = useState<null | boolean>(null);
  const f = useResumeForm();

  // Check if the resume exists in IndexedDB
  // If it exists, load the data into the form
  // If it doesn't exist, show a not found page
  useEffect(() => {
    const checkResumeExists = async () => {
      const data = await loadFormData(resumeId);
      if (!!data) {
        console.log({ data });
        // TODO: figure out why I put it here
        f.reset(data.content);
      }
      setValid(!!data);
    };

    checkResumeExists();
  }, [resumeId, f]);

  if (valid === null) return <p>Загрузка...</p>;
  if (!valid) return notFound();

  return (
    <div className="flex h-screen w-full">
      <Form {...f}>
        <div className="w-full overflow-y-auto border-r md:w-1/2">
          <ResumeEditor resumeId={resumeId} />
        </div>
        <div className="hidden h-screen w-1/2 overflow-y-auto md:flex">
          <ResumePreview />
        </div>
      </Form>
    </div>
  );
};

export default ResumeApp;
