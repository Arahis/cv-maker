"use client";

import { Resume, Source } from "@/api/resumes";
import { getAccessToken } from "@/api/token";
import { ResumeRecord } from "@/lib/indexedDB";
import { useMeQuery } from "@/queries/auth";
import { useAccountResumeQuery } from "@/queries/resumes/accountResumes";
import { useLocalResumeQuery } from "@/queries/resumes/localResumes";

type ResumeEditorControllerState = {
  status: "loading" | "ready" | "not_found" | "forbidden";
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
      enabled: Boolean(resumeId) && meQuery.data?.user !== undefined,
    });

  if (localResume) {
    return {
      status: "ready",
      source: "local",
      resume: localResume,
    };
  }

  if (accountResume) {
    return {
      status: "ready",
      source: "account",
      resume: accountResume,
    };
  }

  if (meQuery.isLoading || isLocalResumeLoading || isAccountResumeLoading) {
    return {
      status: "loading",
      source: null,
      resume: null,
    };
  }

  // State when the user logs out and tries to access a resume that is only available in their account
  if (!meQuery.data?.user) {
    return {
      status: "forbidden",
      source: "account",
      resume: null,
    };
  }

  return {
    status: "not_found",
    source: null,
    resume: null,
  };
}
