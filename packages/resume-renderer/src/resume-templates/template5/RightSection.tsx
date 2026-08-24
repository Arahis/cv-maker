import { ResumeForm } from "@cv-maker/shared";
import React from "react";
import {
  isEducationFilled,
  isWorkExperienceFilled,
} from "../../lib/isSectionFilled.js";
import SectionItem from "./SectionItem.js";
import { formatDate } from "../../utils/formatDate.js";
import { ColumnsRegion } from "../../pagination/Pagination.js";
import { TextReader } from "../../text-reader.js";

const Education = ({ items }: { items: ResumeForm["educations"] }) => {
  const hasEducation = items?.some(isEducationFilled);

  if (!hasEducation) return null;

  return (
    <SectionItem
      columns
      title="Education"
      items={items}
      renderItem={({
        degree,
        institution,
        city,
        startDate,
        endDate,
        isFullDate,
      }) => (
        <div>
          <p className="mb-2 text-[16px] font-bold">{degree}</p>
          <p className="text-[16px]">{institution}</p>
          <div className="mb-0.5">
            {startDate && (
              <p className="mr-2">{`${formatDate(isFullDate, startDate)} - ${endDate ? formatDate(isFullDate, endDate) : "Present"}`}</p>
            )}
            {city && <p className="italic">{city}</p>}
          </div>
        </div>
      )}
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
    description,
    isFullDate,
  } = item;

  return (
    <div className="not-last:mb-6">
      <ColumnsRegion
        leftColumn={
          <div>
            {startDate && (
              <React.Fragment>
                <p className="font-semibold">
                  {`${formatDate(isFullDate, startDate)} - ${endDate ? formatDate(isFullDate, endDate) : "Present"}`}
                </p>
              </React.Fragment>
            )}
            {city && (
              <React.Fragment>
                <p className="font-semibold text-gray-600">{city}</p>
              </React.Fragment>
            )}
          </div>
        }
        rightColumn={
          <div>
            <p className="font-bold uppercase">{position}</p>
            {company && <p className="mb-2 font-semibold">{company}</p>}
            <TextReader value={description || ""} />
          </div>
        }
      ></ColumnsRegion>
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
    <div className="space-y-8 pt-12 pl-6">
      <Experience items={data.workExperiences} />
      <Education items={data.educations} />
    </div>
  );
};

export default RightSection;
