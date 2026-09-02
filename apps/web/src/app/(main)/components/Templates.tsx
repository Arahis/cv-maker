"use client";

import { useState } from "react";
import CreateResumeButton from "./CreateResumeButton";
import { trackEvent } from "@/components/analytics/events";
import { Button } from "@/components/ui/button";
import {
  resumeTemplateMetadata,
  TemplateColumns,
  TemplateKey,
} from "@/components/templates/previews";
import ResumeTemplatePreview from "@/components/templates/ResumeTemplatePreview";

type TemplateFilter = "all" | TemplateColumns | "withPhoto";

const templateFilterOptions: {
  key: TemplateFilter;
  label: string;
}[] = [
  { key: "all", label: "All" },
  { key: "twoColumns", label: "Two columns" },
  { key: "oneColumn", label: "One column" },
  { key: "withPhoto", label: "With photo" },
];

const templateKeys = Object.keys(resumeTemplateMetadata) as TemplateKey[];

const Templates = () => {
  const [activeFilter, setActiveFilter] = useState<TemplateFilter>("all");
  const filteredTemplateKeys = templateKeys.filter((key) => {
    const metadata = resumeTemplateMetadata[key];

    if (activeFilter === "all") return true;
    if (activeFilter === "withPhoto") return metadata.hasPhoto;

    return metadata.columns === activeFilter;
  });

  const handleClick = (onClick: () => void, key: string) => {
    trackEvent("create_resume_click", {
      location: "Home_page",
      var: key,
    });
    onClick();
  };

  return (
    <section aria-labelledby="templates-list">
      <div className="mb-4 md:mb-8">
        <h2 className="font-brand mb-4 text-2xl font-semibold md:text-4xl">
          Choose resume template
        </h2>
      </div>

      <div
        className="mb-8 flex flex-wrap justify-center gap-2"
        role="tablist"
        aria-label="Filter resume templates"
      >
        {templateFilterOptions.map(({ key, label }) => (
          <Button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeFilter === key}
            variant={activeFilter === key ? "secondary" : "ghost"}
            size="sm"
            className="text-xs sm:h-9 sm:px-4 sm:text-sm"
            onClick={() => setActiveFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="mx-auto mb-20 grid grid-cols-[repeat(auto-fit,140px)] justify-center gap-4 sm:grid-cols-[repeat(auto-fit,160px)] md:grid-cols-[repeat(auto-fit,200px)] md:px-20 lg:px-40">
        {filteredTemplateKeys.map((key) => {
          return (
            <CreateResumeButton
              key={key}
              template={key as TemplateKey}
              button={(onClick) => (
                <div
                  onClick={() => handleClick(onClick, key)}
                  className="cursor-pointer"
                >
                  <div className="relative flex aspect-794/1050 min-h-0 w-35 cursor-pointer overflow-hidden rounded-md border-2 p-1 hover:border-blue-300 sm:w-40 md:w-50">
                    <ResumeTemplatePreview template={key as TemplateKey} />
                  </div>
                </div>
              )}
            />
          );
        })}
      </div>

      <p className="font-brand sr-only text-lg md:not-sr-only md:mx-auto md:w-[60%] md:text-2xl">
        Modern resume templates with a paged layout and real-time page preview.
      </p>
    </section>
  );
};

export default Templates;
