import { ResumeForm } from "@cv-maker/shared";
import { cn } from "../../lib/cn.js";
import React from "react";
import { formatDate } from "../../utils/formatDate.js";
import { isWorkExperienceFilled } from "../../lib/isSectionFilled.js";
import SectionItem from "./SectionItem.js";
import { ColumnsRegion } from "../../pagination/Pagination.js";
import { useFitContentWidth } from "../hooks/useFitContentWidth.js";
import { WorkExperienceDescription } from "../WorkExperienceDescription.js";

const heightMap = {
  sm: "h-2 mx-2",
  md: "h-4 mx-4",
  lg: "h-8 mx-6",
} as const;

function Separator({ size = "md" }: { size?: keyof typeof heightMap }) {
  return <div className={cn("w-0.5 bg-gray-500", heightMap[size])} />;
}

const Skills = ({ skills = {} }: { skills: ResumeForm["skills"] }) => {
  const skillsToArray = [
    {
      head: "Stack",
      items: skills?.technical ?? [],
    },
    {
      head: "Strengths",
      items: skills?.personal ?? [],
    },
  ].filter((item) => item.items.length > 0);

  return (
    <ColumnsRegion
      gridTemplateColumns="minmax(0, 5fr) minmax(0, 5fr)"
      className="mb-8"
      leftColumn={
        <SectionItem
          title="Skills"
          items={skillsToArray.slice(0, 1)}
          renderItem={(item) => {
            if (!item?.head) return null;

            return (
              <div key={item.head} className="not-last:mb-4">
                <p className="font-bold">{item.head}</p>
                <p>{item.items.map((i) => i.name).join(", ")}</p>
              </div>
            );
          }}
        />
      }
      rightColumn={
        <SectionItem
          title="Skills"
          hideTitle
          items={skillsToArray.slice(1)}
          renderItem={(item) => {
            if (!item?.head) return null;

            return (
              <div key={item.head} className="not-last:mb-4">
                <p className="font-bold">{item.head}</p>
                <p>{item.items.map((i) => i.name).join(", ")}</p>
              </div>
            );
          }}
        />
      }
    />
  );
};
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

  const { ref: positionRef, width: positionWidth } =
    useFitContentWidth<HTMLParagraphElement>();

  return (
    <div>
      <ColumnsRegion
        className="mb-2 "
        gridTemplateColumns={
          positionWidth === null
            ? "fit-content(50%) minmax(0, 1fr)"
            : `${positionWidth}px minmax(0, 1fr)`
        }
        leftColumn={
          <p className="text-lg font-bold leading-6" ref={positionRef}>
            {position}
          </p>
        }
        rightColumn={
          startDate && (
            <p className="text-lg font-bold text-gray-500 leading-6">
              {`${formatDate(isFullDate, startDate)} - ${endDate ? formatDate(isFullDate, endDate) : "Present"}`}
            </p>
          )
        }
      />
      <ColumnsRegion
        className="mb-4"
        gridTemplateColumns="fit-content(50%) minmax(0, 1fr)"
        leftColumn={company && <p className="font-semibold">{company}</p>}
        rightColumn={city && <p>{city}</p>}
      />
      <WorkExperienceDescription bullets={descriptionBullets} />
    </div>
  );
}

const Experience = ({ items }: { items: ResumeForm["workExperiences"] }) => {
  const isFilledSection = items?.some(isWorkExperienceFilled);

  if (!isFilledSection) return null;

  return (
    <SectionItem
      className="space-y-4"
      title={"Experience"}
      items={items || []}
      renderItem={(item) => <JobSection item={item} />}
    />
  );
};

const LeftSection = ({ data }: { data: ResumeForm }) => {
  return (
    <div className="py-8 pr-6">
      <Skills skills={data.skills || {}} />
      <Experience items={data.workExperiences} />
    </div>
  );
};

export default LeftSection;
