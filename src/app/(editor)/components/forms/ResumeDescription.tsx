"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const ResumeDescription = ({}) => {
  const { control } = useFormContext();

  return (
    <div className="grid gap-6">
      <div className="font-brand text-center">
        <p className="mb-4 text-2xl font-semibold">🎉 Your resume is ready</p>
        <p>Give it a name to keep things organized.</p>
        <p>This won’t be visible to employers.</p>
      </div>
      <div className="grid gap-4">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume name</FormLabel>
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
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Describe what is resume about to not loose it"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ResumeDescription;
