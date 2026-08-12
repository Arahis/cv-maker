import { pdfCss } from "@/pdf/pdfCss";
import { apiFetchBlob } from "./api-fetch";

function getLoadedPageCss() {
  return Array.from(document.styleSheets)
    .flatMap((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules, (rule) => rule.cssText);
      } catch {
        return [];
      }
    })
    .join("\n");
}

export function generateAccountResumePdf({
  resumeId,
  html,
}: {
  resumeId: string;
  html: string;
}) {
  const css = `${pdfCss}\n${getLoadedPageCss()}`;

  return apiFetchBlob("/pdf", {
    method: "POST",
    body: JSON.stringify({
      resumeId,
      html,
      css,
      stylesheets: [],
      baseUrl: window.location.origin,
    }),
  });
}
