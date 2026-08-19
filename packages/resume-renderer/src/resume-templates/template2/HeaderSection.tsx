import { ResumeForm } from "@cv-maker/shared";
import { EMPTY_LEXICAL_STATE } from "../../empty-lexical-state.js";
import { ColumnsRegion } from "../../pagination/Pagination.js";
import { createTextReader, TextReader } from "../../text-reader.js";
import { useFitContentWidth } from "../hooks/useFitContentWidth.js";

const Summary = ({ data }: { data: ResumeForm["summary"] }) => {
  const summary = data || EMPTY_LEXICAL_STATE;
  const hasDescription = createTextReader(summary).text.trim();

  if (!hasDescription) return;
  return <TextReader value={summary} />;
};

const NameAndPosition = ({
  firstName,
  lastName,
}: {
  firstName?: string;
  lastName?: string;
}) => {
  return (
    <p className="text-2xl font-bold text-balance">
      {`${firstName || "First"} ${lastName || "Last"}`}
    </p>
  );
};

const HeaderSection = ({ data }: { data: ResumeForm }) => {
  const { ref: leftContentRef, width: leftWidth } =
    useFitContentWidth<HTMLDivElement>();

  return (
    <ColumnsRegion
      gridTemplateColumns="minmax(0, 70fr) minmax(0, 30fr)"
      className="border-b border-gray-500 pb-8"
      leftColumn={
        <div className="text-sm">
          <ColumnsRegion
            gridTemplateColumns={
              leftWidth === null
                ? "fit-content(40%) minmax(0, 1fr)"
                : `min(${leftWidth}px, 40%) minmax(0, 1fr)`
            }
            className="nested-columns-region mb-4"
            leftColumn={
              <div ref={leftContentRef}>
                <NameAndPosition
                  firstName={data.firstName}
                  lastName={data.lastName}
                />
              </div>
            }
            rightColumn={
              <div className="border-l-4 border-gray-500 pl-6 h-full">
                <p className="text-2xl font-bold text-gray-500">
                  {data.jobTitle || "Profession"}
                </p>
              </div>
            }
          />
          <div>
            <Summary data={data.summary} />
          </div>
        </div>
      }
      rightColumnClassName="h-full"
      rightColumn={
        <div className="pl-4 flex flex-col items-center justify-center h-full">
          <div>
            <p>
              {data.city}, {data.country}
            </p>
            <p>{data.phone}</p>
            <p>{data.email}</p>
          </div>
        </div>
      }
    ></ColumnsRegion>
  );
};

export default HeaderSection;
