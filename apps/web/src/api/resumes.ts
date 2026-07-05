import { ResumeForm, ResumeMedia, ResumeTemplate } from "@cv-maker/shared";
import { apiFetch } from "./api-fetch";

type CreateResumeInput = {
  template: ResumeTemplate;
  data: ResumeForm;
  media: ResumeMedia;
};

type CreateFromLocalResumeInput = {
  template: ResumeTemplate;
  data: ResumeForm;
  media: ResumeMedia;
  localResumeId: string;
};

export type Source = "local" | "account";

export type Resume = CreateResumeInput & {
  id: string;
  updatedAt: number;
  source: Source;
};

type ResumeListResponse = {
  resumes: Resume[];
};

type ResumeResponse = {
  resume: Resume;
};

export async function getResumeList() {
  const response = await apiFetch<ResumeListResponse>("/resumes", {
    method: "GET",
  });

  return response.resumes;
}

export async function getResume(id: string) {
  const response = await apiFetch<ResumeResponse>(`/resumes/${id}`, {
    method: "GET",
  });

  return response.resume;
}

export async function createResume(input: CreateResumeInput) {
  const response = await apiFetch<ResumeResponse>("/resumes", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.resume;
}

export async function updateResume({
  resumeId,
  input,
}: {
  resumeId: string;
  input: CreateResumeInput;
}) {
  const response = await apiFetch<ResumeResponse>(`/resumes/${resumeId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  return response.resume;
}

// TODO: Proper type the input
export async function saveLocalResumeToAccount(input: CreateFromLocalResumeInput) {
  const response = await apiFetch<ResumeResponse>(`/resumes/save-local-to-account`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.resume;
}

export function deleteResume(resumeId: string) {
  return apiFetch<Resume>(`/resumes/${resumeId}`, {
    method: "DELETE",
  });
}
