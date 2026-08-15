import React from "react";
import { createTextReader, TextReader } from "../../text-reader.js";
import { EMPTY_LEXICAL_STATE } from "../../empty-lexical-state.js";
import type { ResumeForm } from "@cv-maker/shared";

const Summary = ({ data }: { data: ResumeForm["summary"] }) => {
  const summary = data || EMPTY_LEXICAL_STATE;
  const hasDescription = createTextReader(summary).text.trim();

  if (!hasDescription) return;

  return (
    <div className="pt-4 pb-10 text-sm" datatype="main-summary">
      <TextReader value={summary} />
    </div>
  );
};

export default Summary;
