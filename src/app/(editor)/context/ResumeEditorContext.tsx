import { createContext, useContext } from "react";

type ResumeEditorContextType = {
  resumeId: string;
};

const ResumeEditorContext = createContext<ResumeEditorContextType | null>(null);

export const useResumeEditor = () => {
  const ctx = useContext(ResumeEditorContext);
  if (!ctx) throw new Error("useResumeEditor must be inside provider");
  return ctx;
};

export const ResumeEditorProvider = ResumeEditorContext.Provider;
