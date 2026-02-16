import React from "react";
import { Paginate } from "../../Paginate";
import { createTextReader, TextReader } from "@/components/editor";
import { EMPTY_LEXICAL_STATE } from "@/lib/formDefaults";
import { ResumeForm } from "@/lib/validation";

const Summary = ({ data }: { data: ResumeForm["summary"] }) => {
  const summary = data || EMPTY_LEXICAL_STATE;
  const hasDescription = createTextReader(summary).text.trim();

  if (!hasDescription) return;

  return (
    <Paginate.Section className="py-8" datatype="main-summary">
      <TextReader value={summary} />
    </Paginate.Section>
  );
};

export default Summary;
