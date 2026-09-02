"use client";

import CreateResumeButton from "./CreateResumeButton";
import { trackEvent } from "@/components/analytics/events";
import {
  resumeTemplatesPreview,
  TemplateKey,
} from "@/components/templates/previews";
import ResumeTemplatePreview from "@/components/templates/ResumeTemplatePreview";

const Templates = () => {
  const handleClick = (onClick: () => void, key: string) => {
    trackEvent("create_resume_click", {
      location: "Home_page",
      var: key,
    });
    onClick();
  };

  return (
    <section aria-labelledby="templates-list">
      <div className="mb-8 md:mb-20">
        <h2 className="font-brand mb-4 text-2xl font-semibold md:text-4xl">
          Choose resume template
        </h2>
        <p className="font-brand sr-only text-lg md:not-sr-only md:mx-auto md:w-[60%] md:text-2xl">
          Choose from modern resume templates and build a professional resume
          directly in your browser.
        </p>
      </div>

      <div className="mx-auto grid grid-cols-[repeat(auto-fit,140px)] justify-center gap-4 sm:grid-cols-[repeat(auto-fit,160px)] md:grid-cols-[repeat(auto-fit,200px)] md:px-20 lg:px-40">
        {Object.keys(resumeTemplatesPreview).map((key) => {
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
    </section>
  );
};

export default Templates;
