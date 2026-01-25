"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { loadAllResumes, ResumeRecord } from "@/lib/indexedDB";
import { cn } from "@/lib/utils";
import { ResumeVariant2 } from "../resume-editor/components/ResumePreview/resume-variants/variant2";

// TODO: create in separate file to import in different places
const getScaleForA4 = (scale: number) => {
  const WIDTH = 794;
  const HEIGHT = 1123;
  return {
    scaledWidth: WIDTH * scale,
    scaledHeight: HEIGHT * scale,
    width: WIDTH,
    height: HEIGHT,
    scale,
  };
};

const ResumeClient = () => {
  const [createdResumes, setCreatedResumes] = React.useState<ResumeRecord[]>(
    [],
  );
  const { scaledWidth, scaledHeight, width, height, scale } =
    getScaleForA4(0.25);
  //   const variant = "variant2";

  useEffect(() => {
    const load = async () => {
      try {
        const resume = await loadAllResumes();
        if (resume) {
          setCreatedResumes(resume);
        }
      } catch (e) {
        console.error("Failed to load resumes", e);
      }
    };
    load();
  }, []);

  console.log({ createdResumes });

  return (
    <div className="mx-auto flex w-[60%] flex-wrap justify-center gap-4">
      {createdResumes.map((r) => (
        <div key={r.id}>
          <Link href={`/resume-editor/${r.id}`}>
            <div
              className={cn(
                "flex rounded-md border-2 p-1 hover:border-blue-300",
              )}
            >
              <div
                className="cursor-pointer overflow-hidden"
                style={{ width: scaledWidth, height: scaledHeight }}
              >
                <div
                  className="origin-top-left transform"
                  style={{ width: width, height: height, scale }}
                >
                  <ResumeVariant2 data={r.data} />
                </div>
              </div>
            </div>
          </Link>
          <div className="px-2">
            <p className="mt-2 text-start text-sm">
              {r.data.title || "Untitled"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResumeClient;
