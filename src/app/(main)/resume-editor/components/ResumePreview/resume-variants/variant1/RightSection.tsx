import React from "react";
import SectionItem from "./SectionItem";
import { Paginate } from "../../Paginate";

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
  const formatDate = (v: string) =>
    item.isFullDate
      ? new Intl.DateTimeFormat("ru-RU").format(new Date(v))
      : new Intl.DateTimeFormat("ru-RU", { year: "numeric" }).format(
          new Date(v),
        );

  return (
    <Paginate.Columns className="mb-6 flex">
      <Paginate.Section className="w-[30%] pr-6">
        <p className="font-semibold uppercase">{item.position}</p>
        <p>{item.city}</p>
        {item.startDate && item.endDate && (
          <p>{`${formatDate(item.startDate)} - ${formatDate(item.endDate)}`}</p>
        )}
      </Paginate.Section>
      <Paginate.Section className="w-[70%]">
        <p className="mb-1 font-bold uppercase">{item.company}</p>
        <Paginate.Text>{item.description}</Paginate.Text>
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
