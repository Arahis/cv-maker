import { ResumeForm } from "@cv-maker/shared";
import { EMPTY_LEXICAL_STATE } from "../../empty-lexical-state.js";
import { createTextReader, TextReader } from "../../text-reader.js";
import SectionItem from "./SectionItem.js";

const Summary = ({ data }: { data: ResumeForm["summary"] }) => {
  const summary = data || EMPTY_LEXICAL_STATE;
  const hasDescription = createTextReader(summary).text.trim();

  if (!hasDescription) return;

  return (
    <div datatype="main-summary">
      <SectionItem
        title="Summary"
        items={[summary]}
        renderItem={(item) => <TextReader value={item} />}
      />
    </div>
  );
};

export default Summary;
