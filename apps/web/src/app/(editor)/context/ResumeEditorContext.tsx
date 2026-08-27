import { createContext, useContext } from "react";
import { ResumeMedia } from "@/lib/validation";
import { Source } from "@/api/resumes";
import { LocalResumeMedia } from "@/lib/indexedDB";

type ResumeEditorContextType = {
  resumeId: string;
  source: Source | null;
  saveMedia: (media: ResumeMedia | LocalResumeMedia) => Promise<void>;
};

const ResumeEditorContext = createContext<ResumeEditorContextType | null>(null);

export const useResumeEditor = () => {
  const ctx = useContext(ResumeEditorContext);
  if (!ctx) throw new Error("useResumeEditor must be inside provider");
  return ctx;
};

export const ResumeEditorProvider = ResumeEditorContext.Provider;
