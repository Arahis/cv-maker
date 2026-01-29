import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ResumeSteps = ({
  items,
  currentStep,
  setItem,
  className,
}: {
  items: string[];
  currentStep: number;
  setItem: (item: number) => void;
  className: string;
}) => {
  return (
    <div className="mb-4">
      <Breadcrumb className={className}>
        <BreadcrumbList>
          {items.map((title, idx) => (
            <React.Fragment key={idx}>
              <BreadcrumbItem>
                {currentStep === idx ? (
                  <BreadcrumbPage className="font-semibold">
                    {title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <button onClick={() => setItem(idx)}>{title}</button>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="last:hidden" />
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default ResumeSteps;
