import { apiFetch } from "./api-fetch";
import { ResumeMedia } from "@cv-maker/shared";

type UploadAvatarResponse = {
  avatar: NonNullable<ResumeMedia["avatar"]>;
};

export async function uploadAvatar(input: {
  croppedFile: Blob;
}) {
  const formData = new FormData();
  formData.append("file", input.croppedFile, "avatar.webp");

  return apiFetch<UploadAvatarResponse>("/uploads/avatar", {
    method: "POST",
    body: formData,
  });
}
