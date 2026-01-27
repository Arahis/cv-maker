"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { deleteResume, loadAllResumes, ResumeRecord } from "@/lib/indexedDB";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { resumeVariants } from "@/components/resume/variants";

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
  const [isLoading, setIsLoading] = React.useState(true);
  const [createdResumes, setCreatedResumes] = React.useState<ResumeRecord[]>(
    [],
  );
  const { scaledWidth, scaledHeight, scale, width, height } =
    getScaleForA4(0.25);

  useEffect(() => {
    const load = async () => {
      try {
        const resume = await loadAllResumes();
        if (resume) {
          setCreatedResumes(resume);
        }
        setIsLoading(false);
      } catch (e) {
        console.error("Failed to load resumes", e);
      }
    };
    load();
  }, []);

  const handleDeleteResumeFromList = async (id: string) => {
    try {
      await deleteResume(id);
      setCreatedResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error("Failed to delete resume", e);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 leading-7">
        <p>Loading...</p>
      </div>
    );
  }

  if (createdResumes.length === 0) {
    return (
      <div className="py-24 leading-7">
        <p>Looks like it is a lot of empty space here!</p>
        <p>Try and Create you first resume!</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-[60%] flex-wrap justify-center gap-4">
      {createdResumes.map((r) => {
        const Variant = resumeVariants[r.variant];

        return (
          <div key={r.id}>
            <Link
              prefetch={false}
              href={`/resume-editor?id=${encodeURIComponent(r.id)}`}
            >
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
                    className="origin-top-left transform text-left"
                    style={{ width: width, height: height, scale: scale }}
                  >
                    <Variant data={r.data} />
                  </div>
                </div>
              </div>
            </Link>
            <div className="mt-2 flex items-center justify-between px-2">
              <p className="text-sm">{r.data.title || "Untitled"}</p>
              <Button
                onClick={() => handleDeleteResumeFromList(r.id)}
                variant="ghost"
                size="icon"
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResumeClient;
