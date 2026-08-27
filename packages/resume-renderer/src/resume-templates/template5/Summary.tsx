import { ResumeForm } from "@cv-maker/shared";
import { EMPTY_LEXICAL_STATE } from "../../empty-lexical-state.js";
import { createTextReader, TextReader } from "../../text-reader.js";

const Summary = ({ data }: { data: ResumeForm["summary"] }) => {
  const summary = data || EMPTY_LEXICAL_STATE;
  const hasDescription = createTextReader(summary).text.trim();

  if (!hasDescription) return;

  return (
    <div datatype="main-summary">
      <TextReader value={summary} />
    </div>
  );
};

export default Summary;
