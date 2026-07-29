import {
  checkAnonymousResumeQuota,
  claimAnonymousResume,
} from "@/api/anonymous-resumes";
import { useMutation } from "@tanstack/react-query";

export function useClaimAnonymousResumeMutation() {
  return useMutation({
    mutationFn: claimAnonymousResume,
  });
}

export function useCheckAnonymousResumeQuotaMutation() {
  return useMutation({
    mutationFn: checkAnonymousResumeQuota,
  });
}
