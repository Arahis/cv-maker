import { ResumeForm, ResumeMedia } from "@cv-maker/shared/resume-schema";
import { apiFetch } from "./api-fetch";

type CreateResumeInput = {
  template: string;
  data: ResumeForm;
  media: ResumeMedia;
};

type Resume = CreateResumeInput;

export function getResumeList() {
  return apiFetch<Resume[]>("/resumes", {
    method: "GET",
  });
}

export function getResume(id: string) {
  return apiFetch<Resume>(`/resumes/${id}`, {
    method: "GET",
  });
}

export function createResume(input: CreateResumeInput) {
  return apiFetch<Resume>("/resumes", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateResume(id: string, input: CreateResumeInput) {
  return apiFetch<Resume>(`/resumes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteResume(id: string) {
  return apiFetch<Resume>(`/resumes/${id}`, {
    method: "DELETE",
  });
}
