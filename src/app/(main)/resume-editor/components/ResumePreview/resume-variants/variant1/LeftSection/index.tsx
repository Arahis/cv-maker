import React from "react";
import SectionItem from "../SectionItem";
import { Paginate } from "../../../Paginate";

const sections = {
  education: {
    name: "Education",
    items: [
      {
        name: "University of Example",
        location: "City, Country",
        years: "2010-2014",
      },
    ],
  },
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

const LeftSection = () => {
  // TODO: refactor later the rest with Paginate
  return (
    <Paginate.Section className="w-[30%]" datatype="left-section">
      {/* <SectionItem
        title={sections.education.name}
        renderItem={(item) => (
          <div>
            <p>{item.name}</p>
            <p>{item.location}</p>
            <p>{item.years}</p>
          </div>
        )}
        items={sections.education.items}
        className="mb-6"
      /> */}
      {/* <div className="mb-6">
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
      </div> */}
      <div className="mb-6" datatype="left-section-wrapper">
        <p className="text-[16px] uppercase" datatype="left-section-text">
          Social
        </p>
        {/* <div className="">
          <p className="font-serif">LinkedIn</p>
          <p className="">Years of education</p>
        </div> */}
      </div>
    </Paginate.Section>
  );
};

export default LeftSection;
