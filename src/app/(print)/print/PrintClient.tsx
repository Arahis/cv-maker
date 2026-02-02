"use client";

import { resumeVariants } from "@/components/resume/variants";
import { loadResume, ResumeRecord } from "@/lib/indexedDB";
import { notFound, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const ResumeWrapperDOM = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="text-[14px]"
      style={{
        width: 794,
      }}
    >
      <div
        data-page-mobile-print
        className="p-6"
        style={{
          width: 794,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const PrintClient = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [resumeData, setResumeData] = useState<ResumeRecord | undefined>();

  // Check if the resume exists in IndexedDB
  // If it exists, load the data into the form
  // If it doesn't exist, show a not found page
  useEffect(() => {
    const checkResumeExists = async () => {
      if (!id) return;

      const resume = await loadResume(id);

      if (!!resume) {
        setResumeData(resume);
      }
    };

    checkResumeExists();
  }, [id]);

  useEffect(() => {
    setTimeout(() => window.print(), 300);
  }, []);

  if (resumeData === undefined) return <p>Loading...</p>;
  if (!resumeData || !id) return notFound();

  const Variant = resumeVariants[resumeData.variant];

  return (
    <ResumeWrapperDOM>
      <Variant
        data={resumeData.data}
        photo={resumeData.media.avatar?.cropped}
      />
    </ResumeWrapperDOM>
  );
};

export default PrintClient;
