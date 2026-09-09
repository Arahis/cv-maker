import React from "react";
import { cn } from "../../lib/cn.js";
import { ResumeForm } from "@cv-maker/shared";
import { formatDate } from "../../utils/formatDate.js";
import { isWorkExperienceFilled } from "../../lib/isSectionFilled.js";
import SectionItem from "./SectionItem.js";
import Summary from "./Summary.js";
import { WorkExperienceDescription } from "../WorkExperienceDescription.js";

const heightMap = {
  sm: "h-2 mx-2",
  md: "h-4 mx-4",
  lg: "h-8 mx-6",
} as const;

function Separator({ size = "md" }: { size?: keyof typeof heightMap }) {
  return (
    <span className={cn("w-0.5 bg-gray-500 inline-block", heightMap[size])} />
  );
}

export function JobSection({
  item,
}: {
  item: NonNullable<ResumeForm["workExperiences"]>[number];
}) {
  const {
    position,
    city,
    startDate,
    endDate,
    company,
    descriptionBullets,
    isFullDate,
  } = item;

  return (
    <div className="not-last:mb-6">
      <p className="text-lg font-bold">{position}</p>

      <div className="mb-2">
        <p className="font-semibold">
          {company && <span>{company}</span>}

          {city && (
            <>
              <Separator size="sm" />
              <span className="text-gray-600">{city}</span>
            </>
          )}

          {startDate && (
            <>
              <Separator size="sm" />
              <span>
                {`${formatDate(isFullDate, startDate)} - ${
                  endDate ? formatDate(isFullDate, endDate) : "Present"
                }`}
              </span>
            </>
          )}
        </p>
      </div>
      <WorkExperienceDescription bullets={descriptionBullets} />
    </div>
  );
}

const Experience = ({ items }: { items: ResumeForm["workExperiences"] }) => {
  const isFilledSection = items?.some(isWorkExperienceFilled);

  if (!isFilledSection) return null;

  return (
    <SectionItem
      title={"Experience"}
      items={items || []}
      renderItem={(item) => <JobSection item={item} />}
    />
  );
};

const RightSection = ({ data }: { data: ResumeForm }) => {
  return (
    <div className="space-y-8 pl-6 [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-gray-600 [&>*:not(:last-child)]:pb-8">
      <Summary data={data.summary} />
      <Experience items={data.workExperiences || []} />
    </div>
  );
};

export default RightSection;
