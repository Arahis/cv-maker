"use client";

import { resumeTemplates } from "@/components/templates/components";
import { getLocalResume, ResumeRecord } from "@/lib/indexedDB";
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
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Check if the resume exists in IndexedDB
  // If it exists, load the data into the form
  // If it doesn't exist, show a not found page
  useEffect(() => {
    const checkResumeExists = async () => {
      if (!id) return;

      const resume = await getLocalResume(id);

      if (!!resume) {
        setResumeData(resume);
      }
    };

    checkResumeExists();
  }, [id]);

  useEffect(() => {
    setTimeout(() => window.print(), 300);
  }, []);

  useEffect(() => {
    const croppedAvatar = resumeData?.media.avatar;

    if (!croppedAvatar?.croppedBlob) {
      setPhotoUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(croppedAvatar.croppedBlob);
    setPhotoUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [resumeData]);

  if (resumeData === undefined) return <p>Loading...</p>;
  if (!resumeData || !id) return notFound();

  const Template = resumeTemplates[resumeData.template || "template1"];

  return (
    <ResumeWrapperDOM>
      <Template
        data={resumeData.data}
        photo={photoUrl}
      />
    </ResumeWrapperDOM>
  );
};

export default PrintClient;
