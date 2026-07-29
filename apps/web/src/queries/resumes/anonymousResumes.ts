import { claimAnonymousResume } from "@/api/anonymous-resumes";
import { useMutation } from "@tanstack/react-query";

export function useClaimAnonymousResumeMutation() {
  return useMutation({
    mutationFn: claimAnonymousResume,
  });
}
