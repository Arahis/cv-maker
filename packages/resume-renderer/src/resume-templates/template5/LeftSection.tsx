import React from "react";
import { Phone } from "lucide-react";
import { Mail } from "lucide-react";
import { MapPin } from "lucide-react";
import { ResumeForm } from "@cv-maker/shared";
import SectionItem from "./SectionItem.js";
import { isLanguageFilled, isSocialFilled } from "../../lib/isSectionFilled.js";
import { formatUrl } from "../../utils/formatUrl.js";
import { KeepTogether } from "../../pagination/Pagination.js";

const Skills = ({ skills = {} }: { skills: ResumeForm["skills"] }) => {
  const skillsToArray = [
    {
      head: "Technical",
      items: skills?.technical ?? [],
    },
    {
      head: "Professional",
      items: skills?.personal ?? [],
    },
  ].filter((item) => item.items.length > 0);

  return (
    <SectionItem
      align="right"
      className="space-y-2"
      title="Skills"
      items={skillsToArray}
      renderItem={(item) => {
        if (!item?.head) return null;

        return (
          <div>
            <p className="font-bold">{item.head}</p>
            <p>{item.items.map((i) => i.name).join(", ")}</p>
          </div>
        );
      }}
    />
  );
};

const Contacts = ({
  items,
}: {
  items: Pick<ResumeForm, "phone" | "city" | "country" | "email">[];
}) => {
  if (!items?.length) return;

  return (
    <SectionItem
      align="right"
      title="Contacts"
      renderItem={({ phone, city, country, email }) => (
        <div className="space-y-2">
          {phone && (
            <div className="flex justify-end gap-3">
              <p className="grow-0">{phone}</p>
              <div className="shrink-0">
                <Phone className="w-4" />
              </div>
            </div>
          )}
          {email && (
            <div className="flex justify-end gap-3">
              <p className="grow-0">{email}</p>
              <div className="shrink-0">
                <Mail className="w-4" />
              </div>
            </div>
          )}
          {(country || city) && (
            <div className="flex justify-end gap-3">
              <p className="grow-0">
                {country}
                {country && city && ", "}
                {city}
              </p>
              <div className="shrink-0">
                <MapPin className="w-4" />
              </div>
            </div>
          )}
        </div>
      )}
      items={items}
    />
  );
};

const SocialLinks = ({ items }: { items: ResumeForm["socialLinks"] }) => {
  const hasLinks = items?.some(isSocialFilled);

  if (!hasLinks) return;

  return (
    <KeepTogether>
      <SectionItem
        align="right"
        className="space-y-2"
        title="Social Links"
        items={items}
        renderItem={(item) => {
          if (!item.linkName) return;
          return (
            <div key={item.id}>
              <p className="font-bold">{item.linkName}</p>
              <a
                href={item.linkAddress}
                target="_blank"
                rel="noopener noreferrer"
              >
                {formatUrl(item.linkAddress)}
              </a>
            </div>
          );
        }}
      />
    </KeepTogether>
  );
};

const Languages = ({ items }: { items: ResumeForm["languages"] }) => {
  const hasLanguages = items?.some(isLanguageFilled);
  if (!hasLanguages) return;

  return (
    <KeepTogether>
      <SectionItem
        align="right"
        className="space-y-2"
        title="Languages"
        items={items}
        renderItem={(item) => {
          return (
            <div key={item.id}>
              <p className="font-bold">{item.languageName}</p>
              <p>{item.languageLevel}</p>
            </div>
          );
        }}
      />
    </KeepTogether>
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
          <KeepTogether key={item.id ?? `${title}-${idx}`}>
            <SectionItem
              align="right"
              className="space-y-2"
              title={title}
              items={sectionItems}
              renderItem={(i) => {
                return (
                  <div key={i.id}>
                    <p className="font-bold">{i.title}</p>
                    <p>{formatUrl(i.value)}</p>
                  </div>
                );
              }}
            />
          </KeepTogether>
        );
      })}
    </React.Fragment>
  );
};

const LeftSection = ({ data }: { data: ResumeForm }) => {
  const {
    languages,
    customSections,
    phone,
    country,
    city,
    email,
    socialLinks,
  } = data;

  const hasAnyValue = [phone, country, city, email].some(
    (v) => typeof v === "string" && v.trim() !== "",
  );
  const contacts = hasAnyValue ? [{ phone, country, city, email }] : [];

  return (
    <div className="space-y-12">
      <Contacts items={contacts} />

      <Skills skills={data.skills} />

      <SocialLinks items={socialLinks} />

      <Languages items={languages} />

      <CustomSections items={customSections} />
    </div>
  );
};

export default LeftSection;
