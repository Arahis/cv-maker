import React from "react";
import { Paginate } from "../../Paginate";
import { formatDate } from "../../utils/formatDate";
import { TextReader } from "@/components/editor";
import { ResumeForm } from "@/lib/validation";
import SectionItem from "./SectionItem";
import { cn } from "@/lib/utils";
import Summary from "./Summary";

const heightMap = {
  sm: "h-2 mx-2",
  md: "h-4 mx-4",
  lg: "h-8 mx-6",
} as const;

function Separator({ size = "md" }: { size?: keyof typeof heightMap }) {
  return <div className={cn("w-0.5 bg-gray-500", heightMap[size])} />;
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
    description,
    isFullDate,
  } = item;

  return (
    <Paginate.Section className="not-last:mb-6">
      <div className="flex items-center">
        <Paginate.Text className="text-lg font-bold">{position}</Paginate.Text>
      </div>
      <div className="mb-2 flex items-center">
        {company && <p className="font-semibold">{company}</p>}
        {city && (
          <React.Fragment>
            <Separator size="sm" />
            <p className="font-semibold text-gray-600">{city}</p>
          </React.Fragment>
        )}
        {startDate && (
          <React.Fragment>
            <Separator size="sm" />
            <p className="font-semibold">
              {`${formatDate(isFullDate, startDate)} - ${endDate ? formatDate(isFullDate, endDate) : "Present"}`}
            </p>
          </React.Fragment>
        )}
      </div>
      <TextReader value={description || ""} />
    </Paginate.Section>
  );
}

const Experience = ({ items }: { items: ResumeForm["workExperiences"] }) => {
  if (items?.length === 0) return;

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
    <Paginate.Section className="w-[70%] space-y-8 border-l border-gray-600 pl-6 [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-gray-600 [&>*:not(:last-child)]:pb-8">
      <Summary data={data.summary} />
      <Experience items={data.workExperiences || []} />
    </Paginate.Section>
  );
};

export default RightSection;
