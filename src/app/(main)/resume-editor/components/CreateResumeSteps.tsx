import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// import { Button } from "@/components/ui/button";

const ResumeSteps = ({
  items,
  currentStep,
  setItem,
  className,
}: {
  items: string[];
  currentStep: number;
  setItem: React.Dispatch<React.SetStateAction<number>>;
  className: string;
}) => {
  // const handleGoToNextItem = () => {
  //   setItem((prev) => Math.max(prev + 1, items.length - 1));
  // };
  // const handleGoToPrevItem = () => {
  //   setItem((prev) => Math.min(0, prev - 1));
  // };

  return (
    <div className="mb-4">
      <Breadcrumb className={className}>
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
      {/* <div className="flex justify-between">
        <Button variant="secondary" onClick={handleGoToPrevItem}>
          Prev Step
        </Button>
        <Button variant="secondary" onClick={handleGoToNextItem}>
          Next Step
        </Button>
      </div> */}
    </div>
  );
};

export default ResumeSteps;
