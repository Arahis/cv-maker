import React from "react";
import SectionItem from "./SectionItem";
import { Paginate } from "../../Paginate";
import { formatDate } from "../../utils/formatDate";
import { TextReader } from "@/components/editor";
import { ResumeForm } from "@/lib/validation";
import { EMPTY_LEXICAL_STATE } from "@/lib/formDefaults";
import { isWorkExperienceFilled } from "../../lib/isWorkExperienceFilled";

// TODO add proper type for item so it could see item fields
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
    <Paginate.Columns className="mb-6 flex">
      <Paginate.Section className="w-[30%] pr-6">
        <p className="font-semibold uppercase">{position}</p>
        <p>{city}</p>
        {startDate && endDate && (
          <p>{`${formatDate(isFullDate, startDate)} - ${formatDate(isFullDate, endDate)}`}</p>
        )}
      </Paginate.Section>
      <Paginate.Section className="w-[70%]">
        <p className="mb-1 font-bold uppercase">{company}</p>
        <TextReader value={description || EMPTY_LEXICAL_STATE} />
      </Paginate.Section>
    </Paginate.Columns>
  );
}

const RightSection = ({ data }: { data: ResumeForm }) => {
  const isFilledSection = data.workExperiences?.some(isWorkExperienceFilled);
  console.log({ isFilledSection });

  if (!isFilledSection) return null;

  return (
    <Paginate.Section
      className="w-[70%] bg-gray-50 pt-8 pl-6"
      datatype="cv_info-right-section"
    >
      <SectionItem
        title={"Job Experience"}
        items={data.workExperiences || []}
        renderItem={(item) => <JobSection item={item} />}
      />
    </Paginate.Section>
  );
};

export default RightSection;
