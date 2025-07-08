"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { generalFormSchema, GeneralResumeForm } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ResumeDescription = ({}) => {
  const f = useForm<GeneralResumeForm>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: GeneralResumeForm) {
    console.log(values);
  }

  return (
    <div>
      <Form {...f}>
        <form onSubmit={f.handleSubmit(onSubmit)}>
          <FormField
            control={f.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Define the name for the resume"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={f.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Describe what is resume about to not loose it"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default ResumeDescription;
