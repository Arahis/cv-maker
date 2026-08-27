import {
  checkAnonymousResumeQuota,
  claimAnonymousResume,
  releaseAnonymousResume,
} from "@/api/anonymous-resumes";
import { useMutation } from "@tanstack/react-query";

export function useClaimAnonymousResumeMutation() {
  return useMutation({
    mutationFn: claimAnonymousResume,
  });
}

export function useReleaseAnonymousResumeMutation() {
  return useMutation({
    mutationFn: releaseAnonymousResume,
  });
}

export function useCheckAnonymousResumeQuotaMutation() {
  return useMutation({
    mutationFn: checkAnonymousResumeQuota,
  });
}
