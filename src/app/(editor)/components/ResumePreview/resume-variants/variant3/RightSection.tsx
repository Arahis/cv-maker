import { formatDate } from "../../utils/formatDate";
import { Paginate } from "../../Paginate";
import { ResumeForm } from "@/lib/validation";
import SectionItem from "./SectionItem";
import React from "react";

const Education = ({ items }: { items: ResumeForm["educations"] }) => {
  if (!items?.length) return;

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
          <p className="mb-2 text-[16px] font-bold">{degree}</p>
          <p className="text-[16px]">{institution}</p>
          <div className="mb-0.5">
            {startDate && (
              <p className="mr-2">{`${formatDate(isFullDate, startDate)} - ${endDate ? formatDate(isFullDate, endDate) : "Present"}`}</p>
            )}
            {city && <p className="italic">{city}</p>}
          </div>
        </div>
      )}
      items={items || []}
    />
  );
};

const SocialLinks = ({ items }: { items: ResumeForm["socialLinks"] }) => {
  if (!items?.length) return;

  return (
    <SectionItem
      title="Social Links"
      items={items}
      renderItem={(item) => {
        if (!item.linkName) return;
        return (
          <React.Fragment key={item.id}>
            <p className="font-bold">{item.linkName}</p>
            <a
              href={item.linkAddress}
              className="break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.linkAddress}
            </a>
          </React.Fragment>
        );
      }}
    />
  );
};

const Languages = ({ items }: { items: ResumeForm["languages"] }) => {
  if (!items?.length) return;

  return (
    <SectionItem
      title="Languages"
      items={items}
      renderItem={(item) => {
        return (
          <React.Fragment key={item.id}>
            <p className="font-bold">{item.languageName}</p>
            <p>{item.languageLevel}</p>
          </React.Fragment>
        );
      }}
    />
  );
};

const CustomSections = ({ items }: { items: ResumeForm["customSections"] }) => {
  if (!items?.length) return;

  return (
    <React.Fragment>
      {items.map((item, idx) => {
        const title = item.sectionName?.trim();
        const sectionItems = item.sectionItems ?? [];

        if (!title) return null;
        if (sectionItems.length === 0) return null;

        return (
          <SectionItem
            key={item.id ?? `${title}-${idx}`}
            title={title}
            items={sectionItems}
            renderItem={(i) => {
              return (
                <React.Fragment key={i.id}>
                  <p className="font-bold">{i.title}</p>
                  <p>{i.value}</p>
                </React.Fragment>
              );
            }}
          />
        );
      })}
    </React.Fragment>
  );
};

const RightSection = ({ data }: { data: ResumeForm }) => {
  const { educations, languages, customSections, socialLinks } = data;

  return (
    <Paginate.Section className="w-[30%] space-y-8 py-8 pl-6">
      <Education items={educations || []} />

      <SocialLinks items={socialLinks} />

      <Languages items={languages} />

      <CustomSections items={customSections} />
    </Paginate.Section>
  );
};

export default RightSection;
