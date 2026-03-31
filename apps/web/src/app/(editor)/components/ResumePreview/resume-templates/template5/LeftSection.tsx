import { Paginate } from "../../Paginate";
import { ResumeForm } from "@/lib/validation";
import SectionItem from "./SectionItem";
import React from "react";
import { Phone } from "lucide-react";
import { Mail } from "lucide-react";
import { MapPin } from "lucide-react";
import { isLanguageFilled, isSocialFilled } from "../../lib/isSectionFilled";
import { formatUrl } from "../../utils/formatUrl";

const Skills = ({ skills = {} }: { skills: ResumeForm["skills"] }) => {
  const skillsToArray = Object.entries(skills).map(([head, items]) => ({
    head: head === "technical" ? "Technical" : "Professional",
    items,
  }));

  if (!skills.personal?.length && !skills.technical?.length) return null;

  return (
    <Paginate.Columns>
      <SectionItem
        align="right"
        title="Skills"
        items={skillsToArray}
        renderItem={(item) => {
          if (item.items.length === 0) return null;

          return (
            <div key={item.head} className="mb-2">
              <p className="font-bold">{item.head}#</p>
              <p>{item.items.map((i) => i.name).join(", ")}</p>
            </div>
          );
        }}
      />
    </Paginate.Columns>
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
            <div className="flex justify-end gap-2">
              <p className="text-[16px]">{phone}</p>
              <Phone className="w-4" />
            </div>
          )}
          {email && (
            <div className="flex justify-end gap-2">
              <p className="text-[16px]">{email}</p>
              <Mail className="w-4" />
            </div>
          )}
          {(country || city) && (
            <div className="flex justify-end gap-2">
              <p className="text-[16px]">
                {country}
                {country && city && ", "}
                {city}
              </p>
              <MapPin className="w-4" />
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
    <SectionItem
      align="right"
      title="Social Links"
      items={items}
      renderItem={(item) => {
        if (!item.linkName) return;
        return (
          <React.Fragment key={item.id}>
            <p className="font-bold">{item.linkName}</p>
            <a
              href={item.linkAddress}
              target="_blank"
              rel="noopener noreferrer"
            >
              {formatUrl(item.linkAddress)}
            </a>
          </React.Fragment>
        );
      }}
    />
  );
};

const Languages = ({ items }: { items: ResumeForm["languages"] }) => {
  const hasLanguages = items?.some(isLanguageFilled);
  if (!hasLanguages) return;

  return (
    <SectionItem
      align="right"
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
            align="right"
            key={item.id ?? `${title}-${idx}`}
            title={title}
            items={sectionItems}
            renderItem={(i) => {
              return (
                <React.Fragment key={i.id}>
                  <p className="font-bold">{i.title}</p>
                  <p>{formatUrl(i.value)}</p>
                </React.Fragment>
              );
            }}
          />
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
    <Paginate.Section className="w-[30%] space-y-12 pr-6">
      <Contacts items={contacts} />

      <Skills skills={data.skills} />

      <SocialLinks items={socialLinks} />

      <Languages items={languages} />

      <CustomSections items={customSections} />
    </Paginate.Section>
  );
};

export default LeftSection;
