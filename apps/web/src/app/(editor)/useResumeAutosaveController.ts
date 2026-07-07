"use client";

import { Source } from "@/api/resumes";
import { debounce } from "@/lib/debounce";
import { updateLocalFormData } from "@/lib/indexedDB";
import { ResumeForm } from "@/lib/validation";
import { useUpdateResume } from "@/queries/resumes/accountResumes";
import { useEffect, useRef } from "react";

export function useResumeAutosaveController({
  resumeId,
  source,
  data,
  debounceMs = 2000,
}: {
  resumeId: string;
  source: Source | null;
  data: ResumeForm;
  debounceMs?: number;
}) {
  const skipNextSave = useRef(true);
  const { mutateAsync: updateAccountResume } = useUpdateResume();

  const debouncedLocalSave = useRef(
    debounce((latestData: ResumeForm) => {
      void updateLocalFormData({
        resumeId,
        data: latestData,
      });
    }, debounceMs),
  ).current;

  const debouncedAccountSave = useRef(
    debounce((latestData: ResumeForm) => {
      void updateAccountResume({
        resumeId,
        input: {
          data: latestData,
        },
      });
    }, debounceMs),
  ).current;

  useEffect(() => {
    if (!source) {
      return;
    }

    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    if (source === "local") {
      debouncedLocalSave(data);
      return;
    }

    debouncedAccountSave(data);
  }, [data, source, debouncedLocalSave, debouncedAccountSave]);
}
