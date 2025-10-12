import React from "react";
import SectionItem from "./SectionItem";
import { Paginate } from "../../Paginate";

export const sections = {
  jobDescription: {
    name: "Job Experience",
    items: [
      {
        position: "Web Developer",
        city: "Melbourne 1",
        years: "2020-2021",
        companyName: "Simple company",
        description:
          "Results-driven Web Developer with 2+ years of experience building responsive, user-friendly web applications. Skilled in developing and maintaining modern front-end interfaces using React, Redux, and TypeScript, with a strong foundation in JavaScript and UI/UX best practices.",
      },
      {
        position: "Web Developer",
        city: "Melbourne 2",
        years: "2020-2021",
        companyName: "Simple company",
        description:
          "Results-driven Web Developer with 2+ years of experience building responsive, user-friendly web applications. Skilled in developing and maintaining modern front-end interfaces using React, Redux, and TypeScript, with a strong foundation in JavaScript and UI/UX best practices. Experienced in collaborating within agile teams, integrating APIs, optimizing performance, and delivering clean, maintainable code. Motivated to continue learning backend technologies (Node.js, Express) to contribute across the full stack. Experienced in collaborating within agile teams, integrating APIs, optimizing performance, and delivering clean, maintainable code. Motivated to continue learning backend technologies (Node.js, Express) to contribute across the full stack.",
      },
      {
        position: "Web Developer",
        city: "Melbourne 3",
        years: "2020-2021",
        companyName: "Simple company",
        description:
          "Results-driven Web Developer with 2+ years of experience building responsive, user-friendly web applications. Skilled in developing and maintaining modern front-end interfaces using React, Redux, and TypeScript, with a strong foundation in JavaScript and UI/UX best practices. Experienced in collaborating within agile teams, integrating APIs, optimizing performance, and delivering clean, maintainable code. Motivated to continue learning backend technologies (Node.js, Express) to contribute across the full stack.",
      },
      // {
      //   position: "Web Developer",
      //   city: "Melbourne 3",
      //   years: "2020-2021",
      //   companyName: "Simple company",
      //   description:
      //     "Results-driven Web Developer with 2+ years of experience building responsive, user-friendly web applications. Skilled in developing and maintaining modern front-end interfaces using React, Redux, and TypeScript, with a strong foundation in JavaScript and UI/UX best practices. Experienced in collaborating within agile teams, integrating APIs, optimizing performance, and delivering clean, maintainable code. Motivated to continue learning backend technologies (Node.js, Express) to contribute across the full stack.",
      // },
    ],
  },
};

type ExperienceItem = {
  position: string;
  city: string;
  years: string;
  companyName: string;
  description: string;
};

// TODO add proper type for item so it could see item fields
export function JobSection({
  item,
  idx,
}: {
  item: ExperienceItem;
  idx: number;
}) {
  return (
    <Paginate.Columns
      className="mb-6 flex"
      datatype={`cv_info-job_section-wrapper-${idx}`}
    >
      <Paginate.Section className="w-[30%] pr-6">
        <p className="font-semibold uppercase">{item.position}</p>
        <p>{item.city}</p>
        <p>{item.years}</p>
      </Paginate.Section>
      <Paginate.Section className="w-[70%]">
        <p className="mb-1 font-bold uppercase">{item.companyName}</p>
        <Paginate.Text datatype={`cv_info-job_section-text-${idx}`}>
          {item.description}
        </Paginate.Text>
      </Paginate.Section>
    </Paginate.Columns>
  );
}

const RightSection = () => {
  return (
    <Paginate.Section
      className="w-[70%] bg-gray-100 pt-8 pl-6"
      datatype="cv_info-right-section"
    >
      <SectionItem
        title={sections.jobDescription.name}
        items={sections.jobDescription.items}
        // TODO Remove idx later, now it is only for dev purpose
        renderItem={(item, idx) => <JobSection item={item} idx={idx} />}
      />
    </Paginate.Section>
  );
};

export default RightSection;
