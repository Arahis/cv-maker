"use client";

import React from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";

const ResumeDescription = ({}) => {
  // Context
  const { control } = useFormContext();

  return (
    <div>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Define the name for the resume" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
    </div>
  );
};

export default ResumeDescription;
