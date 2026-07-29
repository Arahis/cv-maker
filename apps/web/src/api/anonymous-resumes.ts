import { apiFetch } from "./api-fetch";

type ClaimAnonymousResumeInput = {
  localResumeId: string;
  fingerprint: string | null;
};

type ClaimAnonymousResumeResponse = {
  status: "claimed";
};

export function claimAnonymousResume(input: ClaimAnonymousResumeInput) {
  return apiFetch<ClaimAnonymousResumeResponse>("/anonymous-resumes/claim", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
