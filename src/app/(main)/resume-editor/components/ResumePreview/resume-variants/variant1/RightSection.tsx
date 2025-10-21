import React from "react";
import SectionItem from "./SectionItem";
import { Paginate } from "../../Paginate";
import { formatDate } from "../../utils/formatDate";

type ExperienceItem = {
  position: string;
  city: string;
  startDate: string;
  endDate: string;
  company: string;
  description: string;
  isFullDate: boolean;
};

// TODO add proper type for item so it could see item fields
export function JobSection({ item }: { item: ExperienceItem }) {
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
        <Paginate.Text>{description}</Paginate.Text>
      </Paginate.Section>
    </Paginate.Columns>
  );
}

const RightSection = ({ data }: { data: any }) => {
  return (
    <Paginate.Section
      className="w-[70%] bg-gray-100 pt-8 pl-6"
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
