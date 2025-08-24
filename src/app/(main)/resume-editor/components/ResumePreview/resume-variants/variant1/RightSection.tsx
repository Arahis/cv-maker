import React from "react";
import SectionItem from "./SectionItem";

const sections = {
  jobDescription: {
    name: "Job Experience",
    items: [
      {
        position: "Web Developer",
        city: "Melbourne",
        years: "2020-2021",
        companyName: "Simple company",
        description:
          "Results-driven Web Developer with 2+ years of experience building responsive, user-friendly web applications. Skilled in developing and maintaining modern front-end interfaces using React, Redux, and TypeScript, with a strong foundation in JavaScript and UI/UX best practices. Experienced in collaborating within agile teams, integrating APIs, optimizing performance, and delivering clean, maintainable code. Motivated to continue learning backend technologies (Node.js, Express) to contribute across the full stack.",
      },
      {
        position: "Web Developer",
        city: "Melbourne",
        years: "2020-2021",
        companyName: "Simple company",
        description:
          "Results-driven Web Developer with 2+ years of experience building responsive, user-friendly web applications. Skilled in developing and maintaining modern front-end interfaces using React, Redux, and TypeScript, with a strong foundation in JavaScript and UI/UX best practices. Experienced in collaborating within agile teams, integrating APIs, optimizing performance, and delivering clean, maintainable code. Motivated to continue learning backend technologies (Node.js, Express) to contribute across the full stack.",
      },
      {
        position: "Web Developer",
        city: "Melbourne",
        years: "2020-2021",
        companyName: "Simple company",
        description:
          "Results-driven Web Developer with 2+ years of experience building responsive, user-friendly web applications. Skilled in developing and maintaining modern front-end interfaces using React, Redux, and TypeScript, with a strong foundation in JavaScript and UI/UX best practices. Experienced in collaborating within agile teams, integrating APIs, optimizing performance, and delivering clean, maintainable code. Motivated to continue learning backend technologies (Node.js, Express) to contribute across the full stack.",
      },
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
function JobSection({ item }: { item: ExperienceItem }) {
  return (
    <div className="mb-6 flex">
      <div className="w-[30%] pr-6">
        <p className="font-semibold uppercase">{item.position}</p>
        <p>{item.city}</p>
        <p>{item.years}</p>
      </div>
      <div>
        <p className="mb-1 font-bold uppercase">{item.companyName}</p>
        <p>{item.description}</p>
      </div>
    </div>
  );
}

const RightSection = () => {
  return (
    <div className="w-[70%] bg-gray-100 pt-8 pl-6">
      <SectionItem
        title={sections.jobDescription.name}
        items={sections.jobDescription.items}
        renderItem={(item) => <JobSection item={item} />}
      />
    </div>
  );
};

export default RightSection;
