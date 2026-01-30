"use client";

import { useSearchParams } from "next/navigation";
import ResumeApp from "../components/ResumeApp";

const ResumeEditorPageClient = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return <ResumeApp resumeId={id} />;
};

export default ResumeEditorPageClient;
