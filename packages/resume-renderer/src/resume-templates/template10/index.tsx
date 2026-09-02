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
import { ColumnsRegion } from "../../pagination/Pagination.js";
import SocialLinks from "./SocialLinks.js";

export const ResumeTemplate10 = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ data, photo }, ref) => {
    return (
      <PaginationDocument
        ref={ref}
        className="text-sm"
        pagePaddingX={42}
        id="template10"
        revision={JSON.stringify(data)}
      >
        <ColumnsRegion
          gridTemplateColumns="8fr 2fr"
          className="template10-bg mb-6"
          leftColumn={<HeaderSection data={data} photo={photo} />}
          rightColumn={<Contacts data={data} />}
        />

        <div className="space-y-6">
          <Summary data={data.summary} />
          <Experience items={data.workExperiences || []} />
          <Education items={data.educations} />
          <Skills skills={data.skills} />
          <SocialLinks items={data.socialLinks} />
          <Languages items={data.languages} />
          <CustomSections items={data.customSections} />
        </div>
      </PaginationDocument>
    );
  },
);

ResumeTemplate10.displayName = "ResumeTemplate10";
