import React from "react";
import SectionItem from "../SectionItem";
import { Paginate } from "../../../Paginate";
import { formatDate } from "../../../utils/formatDate";

const sections = {
  skills: {
    name: "Skills",
    items: [
      {
        head: "Technical",
        items: ["React Native", "JavaScript", "NextJs", "TypeScript"],
      },
      {
        head: "Personal",
        items: ["Communication", "Teamwork", "Problem Solving", "Adaptability"],
      },
    ],
  },
};

const Education = ({ educations }: { educations: any }) => {
  return (
    <SectionItem
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
          <p className="text-[16px] font-bold">{degree}</p>
          <p className="mb-1 text-[16px]">{institution}</p>
          <p>{city}</p>
          {startDate && endDate && (
            <p>{`${formatDate(isFullDate, startDate)} - ${formatDate(isFullDate, endDate)}`}</p>
          )}
        </div>
      )}
      items={educations}
      className="mb-6"
    />
  );
};

const LeftSection = ({ data }: { data: any }) => {
  const { educations } = data;
  // TODO: refactor later the rest with Paginate
  return (
    <Paginate.Section className="w-[30%]" datatype="left-section">
      <Education educations={educations || []} />
      <div className="mb-6">
        <SectionItem
          title={sections.skills.name}
          items={sections.skills.items}
          renderItem={(item) => (
            <React.Fragment key={item.head}>
              <p className="font-bold">#{item.head}</p>
              <p>{item.items.join(", ")}</p>
            </React.Fragment>
          )}
        />
      </div>
      <div className="mb-6" datatype="left-section-wrapper">
        <p className="text-[16px] uppercase" datatype="left-section-text">
          Social
        </p>
        <div className="">
          <p className="font-serif">LinkedIn</p>
          <p className="">Years of education</p>
        </div>
      </div>
    </Paginate.Section>
  );
};

export default LeftSection;
