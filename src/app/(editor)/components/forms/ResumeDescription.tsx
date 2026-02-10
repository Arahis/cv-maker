"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const ResumeDescription = ({ onPrintClick }: { onPrintClick: () => void }) => {
  const { control } = useFormContext();

  return (
    <div className="grid gap-6">
      <div className="font-brand text-center">
        <p className="mb-4 text-2xl font-semibold">🎉 Your resume is ready</p>
        <p>Give it a name to keep things organized.</p>
        <p>This won’t be visible to employers.</p>
      </div>
      <div className="grid gap-4 md:px-12">
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
      <div className="mb-4 text-center">
        <p className="text-lg font-semibold">
          That’s it — your resume is ready to print or save as PDF.
        </p>
        <p className="mb-4 text-sm text-gray-400">
          You can always come back and make changes later.
        </p>
        <Button onClick={onPrintClick} className="cursor-pointer">
          Print / Save as PDF
        </Button>
      </div>
    </div>
  );
};

export default ResumeDescription;
