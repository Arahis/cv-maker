import { ResumeForm, ResumeMedia, TailorAnalysis } from "@cv-maker/shared";
import { apiFetch } from "./api-fetch";
import { ResumeTemplateKey } from "@/components/templates/components";
import { LocalResumeMedia } from "@/lib/indexedDB";

type CreateResumeInput = {
  template: ResumeTemplateKey;
  data: ResumeForm;
  media: ResumeMedia | LocalResumeMedia;
};

type UpdateResumeInput = {
  data?: Partial<ResumeForm>;
};

type CreateFromLocalResumeInput = {
  template: ResumeTemplateKey;
  data: ResumeForm;
  media: ResumeMedia;
  localResumeId: string;
};

export type TailorResumeInput = {
  jobTitle: string;
  jobDescription: string;
  jobDescriptionUrl?: string;
};

export type Source = "local" | "account";

export type Resume = CreateResumeInput & {
  id: string;
  updatedAt: string | number;
  position: number;
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

export async function copyResume(id: string) {
  const response = await apiFetch<ResumeResponse>(`/resumes/${id}/copy`, {
    method: "POST",
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
  input: UpdateResumeInput;
}) {
  const response = await apiFetch<ResumeResponse>(`/resumes/${resumeId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  return response.resume;
}

export async function updateResumeTemplate({
  resumeId,
  template,
}: {
  resumeId: string;
  template: ResumeTemplateKey;
}) {
  const response = await apiFetch<ResumeResponse>(
    `/resumes/${resumeId}/template`,
    {
      method: "PATCH",
      body: JSON.stringify({ template }),
    },
  );

  return response.resume;
}

export async function updateResumeMedia({
  resumeId,
  media,
}: {
  resumeId: string;
  media: ResumeMedia;
}) {
  const response = await apiFetch<ResumeResponse>(
    `/resumes/${resumeId}/media`,
    {
      method: "PATCH",
      body: JSON.stringify({ media }),
    },
  );

  return response.resume;
}

export async function tailorResume({
  resumeId,
  input,
}: {
  resumeId: string;
  input: TailorResumeInput;
}) {
  return apiFetch<TailorAnalysis>(`/resumes/${resumeId}/tailor`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// TODO: Proper type the input
export async function saveLocalResumeToAccount(
  input: CreateFromLocalResumeInput,
) {
  const response = await apiFetch<ResumeResponse>(
    `/resumes/save-local-to-account`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  return response.resume;
}

export function deleteResume(resumeId: string) {
  return apiFetch<Resume>(`/resumes/${resumeId}`, {
    method: "DELETE",
  });
}
