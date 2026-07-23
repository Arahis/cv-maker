"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";
import {
  DEFAULT_RESUME_TEMPLATE_COMPONENT,
  resumeTemplates,
} from "@/components/templates/components";
import { ResumeController, useResumeController } from "./useResumeController";
import { Resume } from "@/api/resumes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const ResumeCard = ({
  resume,
  copyResume,
  deleteResume,
  openResume,
}: Omit<ResumeController, "resumes" | "isLoading"> & { resume: Resume }) => {
  const { id, template, data, source } = resume;
  const Template =
    resumeTemplates[template] ?? DEFAULT_RESUME_TEMPLATE_COMPONENT;

  const { scaledWidth, scaledHeight, scale, width, height } =
    getScaleForA4(0.25);

  return (
    <div key={id}>
      <div
        onClick={() => openResume({ resumeId: id, source })}
        className="cursor-pointer"
      >
        <div
          className={cn("flex rounded-md border-2 p-1 hover:border-blue-300")}
        >
          <div
            className="cursor-pointer overflow-hidden"
            style={{ width: scaledWidth, height: scaledHeight }}
          >
            <div
              className="origin-top-left transform text-left"
              style={{ width: width, height: height, scale: scale }}
            >
              <Template data={data} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-left text-sm">{data.title || "Untitled"}</p>
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => copyResume({ resumeId: id, source })}
                variant="ghost"
                size="icon"
              >
                <Copy />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy resume</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => deleteResume({ resumeId: id, source })}
                variant="ghost"
                size="icon"
              >
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete resume</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

const ResumeList = () => {
  const { isLoading, resumes, ...controls } = useResumeController();
  const { scaledWidth } = getScaleForA4(0.25);

  if (isLoading) {
    return (
      <div className="py-24 leading-7">
        <p>Loading...</p>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="py-24 leading-7">
        <p>Looks like it is a lot of empty space here!</p>
        <p>Try and Create you first resume!</p>
      </div>
    );
  }

  return (
    <div
      className="mx-auto grid w-[60%] justify-center gap-4"
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${scaledWidth + 8}px)`,
      }}
    >
      {resumes.map((r) => (
        <ResumeCard key={r.id} resume={r} {...controls} />
      ))}
    </div>
  );
};

export default ResumeList;
