"use client";

import { useSearchParams } from "next/navigation";
import ResumeApp from "../components/ResumeApp";

const ResumeEditorPageClient = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div className="mx-auto flex w-full max-w-400">
      <ResumeApp resumeId={id} />
    </div>
  );
};

export default ResumeEditorPageClient;
