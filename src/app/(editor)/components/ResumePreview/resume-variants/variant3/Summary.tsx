import React from "react";
import { Paginate } from "../../Paginate";
import { TextReader } from "@/components/editor";
import SectionItem from "./SectionItem";
import { ResumeForm } from "@/lib/validation";

const Summary = ({ data }: { data: ResumeForm }) => {
  if (!data.summary) return;
  return (
    <Paginate.Section
      datatype="main-summary"
      className="border-b border-yellow-400 py-8"
    >
      <SectionItem
        title="Summary"
        items={[data.summary]}
        renderItem={(item) => <TextReader value={item} />}
      />
    </Paginate.Section>
  );
};

export default Summary;
