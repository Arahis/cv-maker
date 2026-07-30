"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const ResumeActionContext = createContext<{
  isResumeActionPending: boolean;
  setIsResumeActionPending: (isPending: boolean) => void;
} | null>(null);

export function ResumeActionProvider({ children }: { children: ReactNode }) {
  const [isResumeActionPending, setIsResumeActionPending] = useState(false);

  return (
    <ResumeActionContext.Provider
      value={{ isResumeActionPending, setIsResumeActionPending }}
    >
      {children}
    </ResumeActionContext.Provider>
  );
}

export function useResumeAction() {
  const context = useContext(ResumeActionContext);

  if (!context) {
    throw new Error("useResumeAction must be used within ResumeActionProvider");
  }

  return context;
}
