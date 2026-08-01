import { apiFetch } from "./api-fetch";
import { ResumeForm, ResumeMedia } from "@cv-maker/shared";
import { ResumeTemplateKey } from "@/components/templates/components";

type UploadAvatarResponse = {
  avatar: NonNullable<ResumeMedia["avatar"]>;
};

type ParseResumeResponse = {
  resume: {
    data: ResumeForm;
    template: ResumeTemplateKey;
    media: ResumeMedia;
  };
};

type CheckPdfParseLimitResponse = {
  canParse: boolean;
};

export async function checkPdfParseLimit() {
  return apiFetch<CheckPdfParseLimitResponse>("/pars-resume/check", {
    method: "POST",
  });
}

export async function uploadAvatar(input: { croppedFile: Blob }) {
  const formData = new FormData();
  formData.append("file", input.croppedFile, "avatar.webp");

  return apiFetch<UploadAvatarResponse>("/uploads/avatar", {
    method: "POST",
    body: formData,
  });
}

export async function parseResume(file: File) {
  const formData = new FormData();
  formData.append("file", file, file.name);

  return apiFetch<ParseResumeResponse>("/pars-resume", {
    method: "POST",
    body: formData,
  });
}
