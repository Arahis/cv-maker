import { apiFetchBlob } from "./api-fetch";

export function generateAccountResumePdf(resumeId: string) {
  return apiFetchBlob("/pdf", {
    method: "POST",
    body: JSON.stringify({
      resumeId,
    }),
  });
}
