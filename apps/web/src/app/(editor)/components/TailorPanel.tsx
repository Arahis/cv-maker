"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { TailorAnalysis } from "@cv-maker/shared";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { tailorResume, type TailorResumeInput } from "@/api/resumes";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const tailorFormSchema = z.object({
  jobTitle: z.string().trim().min(1, "Job title is required"),
  jobDescription: z.string().trim().min(1, "Job description is required"),
  jobDescriptionUrl: z.union([z.url(), z.literal("")]),
});

type TailorFormValues = z.infer<typeof tailorFormSchema>;

function AnalysisResult({ analysis }: { analysis: TailorAnalysis }) {
  return (
    <div className="space-y-5 border-t pt-5">
      <section>
        <h3 className="mb-2 font-medium">Job requirements</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {analysis.jobRequirements.map((item, index) => (
            <li key={`${item.requirement}-${index}`}>
              {item.requirement}{" "}
              <span className="text-muted-foreground">({item.importance})</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 font-medium">Strong matches</h3>
        <div className="space-y-2 text-sm">
          {analysis.strongMatches.map((item, index) => (
            <div key={`${item.requirement}-${index}`}>
              <p className="font-medium">{item.requirement}</p>
              <p className="text-muted-foreground">{item.evidence}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-medium">Missing requirements</h3>
        <div className="space-y-2 text-sm">
          {analysis.missingRequirements.map((item, index) => (
            <div key={`${item.requirement}-${index}`}>
              <p className="font-medium">{item.requirement}</p>
              <p className="text-muted-foreground">{item.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-medium">Suggested improvements</h3>
        {analysis.suggestions.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nothing suggested.</p>
        ) : (
          <div className="space-y-3 text-sm">
            {analysis.suggestions.map((item, index) => (
              <div
                className="rounded-md border p-3"
                key={`${item.targetId}-${index}`}
              >
                <p className="mb-1 font-medium">{item.reason}</p>
                <p className="text-muted-foreground">{item.original}</p>
                <p className="mt-1">{item.suggested}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function TailorPanel({ resumeId }: { resumeId: string }) {
  const [analysis, setAnalysis] = useState<TailorAnalysis | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const form = useForm<TailorFormValues>({
    resolver: zodResolver(tailorFormSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      jobDescriptionUrl: "",
    },
  });

  const onSubmit = async (values: TailorFormValues) => {
    setRequestError(null);

    const input: TailorResumeInput = {
      jobTitle: values.jobTitle,
      jobDescription: values.jobDescription,
      ...(values.jobDescriptionUrl
        ? { jobDescriptionUrl: values.jobDescriptionUrl }
        : {}),
    };

    try {
      setAnalysis(await tailorResume({ resumeId, input }));
    } catch {
      setRequestError("Unable to analyze this resume. Please try again.");
    }
  };

  return (
    <aside className="bg-background w-full overflow-y-auto border-l md:w-1/3">
      <div className="w-full space-y-5 p-4 md:p-6">
        <div>
          <h2 className="text-lg font-semibold">Tailor resume</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Compare your resume with a job description.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job title</FormLabel>
                  <FormControl>
                    <Input placeholder="Frontend Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobDescriptionUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job description URL (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/job"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the job description here..."
                      className="max-h-48 min-h-24 resize-none overflow-y-auto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting ? "Tailor..." : "Tailor resume"}
            </Button>
          </form>
        </Form>

        {requestError && (
          <p className="text-destructive text-sm">{requestError}</p>
        )}
        {analysis && <AnalysisResult analysis={analysis} />}
      </div>
    </aside>
  );
}
