import { ResumeForm } from "@cv-maker/shared";
import { ColumnsRegion } from "../../pagination/Pagination.js";
import Summary from "./Summary.js";

const HeaderSection = ({
  data,
  photo,
}: {
  data: ResumeForm;
  photo?: string | null;
}) => {
  return (
    <ColumnsRegion
      leftColumn={
        <div>
          {photo && (
            <div
              className="aspect-square w-40 rounded-full bg-gray-50 bg-cover bg-center outline-1 outline-offset-4 ml-auto"
              style={{
                backgroundImage: photo ? `url(${photo})` : undefined,
              }}
            ></div>
          )}
        </div>
      }
      rightColumn={
        <div className="pl-6">
          <div className="mb-4">
            <p className="font-brand text-3xl font-bold">Hi! I&apos;m</p>
            <p className="font-brand mb-1 text-3xl font-bold">
              {data.firstName} {data.lastName}
            </p>
            <p className="font-brand text-xl uppercase">{data.jobTitle}</p>
          </div>
          <Summary data={data.summary} />
        </div>
      }
    ></ColumnsRegion>
  );
};

export default HeaderSection;
