"use client";

import React from "react";
import ResumeEditor from "../ResumeEditor";
import ResumePreview from "../ResumePreview";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/lib/validation";
import { Form } from "@/components/ui/form";

const ResumeApp = () => {
  const f = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      title: "",
      description: "",

      photo: undefined,
      firstName: "",
      lastName: "",
      jobTitle: "",
      city: "",
      country: "",
      phone: "",
      email: "",

      workExperiences: [],
      educations: [],
      skills: [],
      summary: "",
    },
  });
  return (
    <Form {...f}>
      <div className="w-full md:w-1/2">
        <ResumeEditor />
      </div>
      <div className="hidden w-1/2 md:flex">
        <ResumePreview />
      </div>
    </Form>
  );
};

export default ResumeApp;
