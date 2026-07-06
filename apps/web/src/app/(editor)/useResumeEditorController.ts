"use client";

import { Resume, Source } from "@/api/resumes";
import { ResumeRecord } from "@/lib/indexedDB";
import { useMeQuery } from "@/queries/auth";
import { useAccountResumeQuery } from "@/queries/resumes/accountResumes";
import { useLocalResumeQuery } from "@/queries/resumes/localResumes";

type ResumeEditorControllerState = {
  isLoading: boolean;
  source: Source | null;
  resume: Resume | ResumeRecord | null;
};

export function useResumeEditorController(
  resumeId: string | null,
): ResumeEditorControllerState {
  const meQuery = useMeQuery();

  const { data: localResume, isLoading: isLocalResumeLoading } =
    useLocalResumeQuery(resumeId ?? "");

  const { data: accountResume, isLoading: isAccountResumeLoading } =
    useAccountResumeQuery({
      resumeId: resumeId ?? "",
      enabled: Boolean(resumeId) && meQuery.isSuccess,
    });

  if (localResume) {
    return {
      isLoading: false,
      source: "local",
      resume: localResume,
    };
  }

  if (accountResume) {
    return {
      isLoading: false,
      source: "account",
      resume: accountResume,
    };
  }

  if (meQuery.isLoading || isLocalResumeLoading || isAccountResumeLoading) {
    return {
      isLoading: true,
      source: null,
      resume: null,
    };
  }

  return {
    isLoading: false,
    source: null,
    resume: null,
  };
}
