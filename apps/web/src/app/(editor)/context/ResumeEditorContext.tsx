import { createContext, useContext } from "react";
import { ResumeMedia } from "@/lib/validation";

type ResumeEditorContextType = {
  resumeId: string;
  saveMedia: (media: ResumeMedia) => Promise<void>;
};

const ResumeEditorContext = createContext<ResumeEditorContextType | null>(null);

export const useResumeEditor = () => {
  const ctx = useContext(ResumeEditorContext);
  if (!ctx) throw new Error("useResumeEditor must be inside provider");
  return ctx;
};

export const ResumeEditorProvider = ResumeEditorContext.Provider;
