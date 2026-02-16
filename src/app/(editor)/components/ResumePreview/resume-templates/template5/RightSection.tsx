import React from "react";
import { Paginate } from "../../Paginate";
import { formatDate } from "../../utils/formatDate";
import { TextReader } from "@/components/editor";
import { ResumeForm } from "@/lib/validation";
import SectionItem from "./SectionItem";
import {
  isEducationFilled,
  isWorkExperienceFilled,
} from "../../lib/isSectionFilled";

const Education = ({ items }: { items: ResumeForm["educations"] }) => {
  const hasEducation = items?.some(isEducationFilled);

  if (!hasEducation) return null;

  return (
    <SectionItem
      columns
      title="Education"
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
      items={items}
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
    <Paginate.Section className="not-last:mb-6">
      <Paginate.Columns>
        <div className="w-[20%]">
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
        <div className="w-[80%]">
          <Paginate.Text className="font-bold uppercase">
            {position}
          </Paginate.Text>
          {company && <p className="mb-2 font-semibold">{company}</p>}
          <TextReader value={description || ""} />
        </div>
      </Paginate.Columns>
    </Paginate.Section>
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
    <Paginate.Section className="w-[70%] space-y-8 border-l border-gray-600 pt-12 pl-6">
      <Experience items={data.workExperiences} />
      <Education items={data.educations} />
    </Paginate.Section>
  );
};

export default RightSection;
