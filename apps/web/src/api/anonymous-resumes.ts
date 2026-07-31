import { apiFetch } from "./api-fetch";

type ClaimAnonymousResumeInput = {
  localResumeId: string;
  fingerprint: string | null;
  hasEverUploaded: boolean;
};

type CheckAnonymousResumeQuotaInput = {
  fingerprint: string | null;
  hasEverUploaded: boolean;
};

type ClaimAnonymousResumeResponse = {
  status: "claimed";
};

type CheckAnonymousResumeQuotaResponse = {
  status: "available";
};

type ReleaseAnonymousResumeInput = {
  localResumeId: string;
};

export function checkAnonymousResumeQuota(
  input: CheckAnonymousResumeQuotaInput,
) {
  return apiFetch<CheckAnonymousResumeQuotaResponse>(
    "/anonymous-resumes/check",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function claimAnonymousResume(input: ClaimAnonymousResumeInput) {
  return apiFetch<ClaimAnonymousResumeResponse>("/anonymous-resumes/claim", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function releaseAnonymousResume(input: ReleaseAnonymousResumeInput) {
  return apiFetch<{ status: "released" | "ignored" }>(
    "/anonymous-resumes/release",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}
