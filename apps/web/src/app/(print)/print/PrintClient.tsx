"use client";

import { resumeTemplates } from "@/components/templates/components";
import Loading from "@/components/Loading";
import { useResumeEditorController } from "@/app/(editor)/useResumeEditorController";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PrintClient = () => {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");
  const { status, resume } = useResumeEditorController(resumeId);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const hasPrinted = useRef(false);

  useEffect(() => {
    if (!resume) {
      setPhotoUrl(null);
      return;
    }

    const avatar = resume.media?.avatar;

    if (!avatar) {
      setPhotoUrl(null);
      return;
    }

    // Local resumes keep the cropped image in IndexedDB as a Blob.
    if ("croppedBlob" in avatar) {
      const objectUrl = URL.createObjectURL(avatar.croppedBlob);
      setPhotoUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    // Account resumes keep the uploaded image on the backend/storage.
    setPhotoUrl(avatar.croppedUrl);
  }, [resume]);

  useEffect(() => {
    if (status !== "ready" || !resume || hasPrinted.current) return;

    const hasAvatar = Boolean(resume.media?.avatar);
    if (hasAvatar && !photoUrl) return;

    let cancelled = false;
    let timeoutId: number | undefined;

    const printWhenReady = async () => {
      await document.fonts?.ready;

      const images = Array.from(document.images);
      await Promise.all(
        images.map((image) => image.decode().catch(() => undefined)),
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled || hasPrinted.current) return;

          hasPrinted.current = true;
          timeoutId = window.setTimeout(() => window.print(), 300);
        });
      });
    };

    void printWhenReady();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [photoUrl, resume, status]);

  if (!resumeId || status === "not_found" || status === "forbidden") {
    return notFound();
  }

  if (status === "loading" || !resume) {
    return <Loading />;
  }

  const Template = resumeTemplates[resume.template || "template1"];

  return <Template data={resume.data} photo={photoUrl} />;
};

export default PrintClient;
