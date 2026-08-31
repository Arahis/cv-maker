import { forwardRef } from "react";
import { ResumeTemplateProps } from "../../types.js";
import PaginationDocument from "../../pagination/PaginationDocument.js";
import HeaderSection from "./HeaderSection.js";
import Contacts from "./Contacts.js";
import Summary from "./Summary.js";
import Experience from "./Experience.js";
import Education from "./Education.js";
import Skills from "./Skills.js";
import Languages from "./Languages.js";
import CustomSections from "./CustomSection.js";

export const ResumeTemplate7 = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ data }, ref) => {
    return (
      <PaginationDocument
        ref={ref}
        className="text-sm"
        pagePaddingX={36}
        id="template7"
        revision={JSON.stringify(data)}
      >
        <HeaderSection data={data} />
        <Contacts data={data} />
        <div className="space-y-4">
          <Summary data={data.summary} />
          <Experience items={data.workExperiences || []} />
          <Education items={data.educations} />
          <Skills skills={data.skills} />
          <Languages items={data.languages} />
          <CustomSections items={data.customSections} />
        </div>
      </PaginationDocument>
    );
  },
);

ResumeTemplate7.displayName = "ResumeTemplate7";
