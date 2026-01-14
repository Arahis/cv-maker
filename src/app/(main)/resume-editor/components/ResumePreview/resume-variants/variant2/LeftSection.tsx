import React from "react";
import { Paginate } from "../../Paginate";
import { formatDate } from "../../utils/formatDate";
import { TextReader } from "@/components/editor";
import { ResumeForm } from "@/lib/validation";
import SectionItem from "./SectionItem";

function Separator() {
  return <div className="mx-4 h-4 w-0.5 bg-gray-500" />;
}
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
    <Paginate.Section className="not-last:mb-8">
      <div className="mb-1 flex items-center">
        <Paginate.Text className="text-lg font-bold">{company}</Paginate.Text>
        <Separator />
        <Paginate.Text className="text-lg font-bold text-gray-500">
          {position}
        </Paginate.Text>
      </div>
      <div className="mb-1 flex">
        {startDate && (
          <p className="pr-4 font-bold text-gray-400">{`${formatDate(isFullDate, startDate)} - ${endDate ? formatDate(isFullDate, endDate) : "Present"}`}</p>
        )}
        {city && <p className="text-gray-400 italic">{city}</p>}
      </div>
      <TextReader value={description || ""} />
    </Paginate.Section>
  );
}

const LeftSection = ({ data }: { data: ResumeForm }) => {
  if (data.workExperiences?.length === 0) return;

  return (
    <Paginate.Section className="">
      <SectionItem
        title={"Job Experience"}
        items={data.workExperiences || []}
        renderItem={(item) => <JobSection item={item} />}
      />
    </Paginate.Section>
  );
};

export default LeftSection;
