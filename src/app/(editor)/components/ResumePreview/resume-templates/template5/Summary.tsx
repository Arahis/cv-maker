import React from "react";
import { Paginate } from "../../Paginate";
import { TextReader } from "@/components/editor";
import { ResumeForm } from "@/lib/validation";
import { EMPTY_LEXICAL_STATE } from "@/lib/formDefaults";

const Summary = ({ data }: { data: ResumeForm["summary"] }) => {
  if (!data) return;

  const summary = data || EMPTY_LEXICAL_STATE;
  return (
    <Paginate.Section datatype="main-summary">
      <TextReader value={summary} />
    </Paginate.Section>
  );
};

export default Summary;
