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
}: {
  items: string[];
  currentStep: number;
  setItem: (title: number) => void;
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((title, idx) => (
          <React.Fragment key={idx}>
            <BreadcrumbItem>
              {currentStep === idx ? (
                <BreadcrumbPage>{title}</BreadcrumbPage>
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
  );
};

export default ResumeSteps;
