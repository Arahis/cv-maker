import { ResumeForm } from "@cv-maker/shared";
import { ColumnsRegion } from "../../index.js";

const HeaderSection = ({
  data,
  photo,
}: {
  data: ResumeForm;
  photo?: string | null;
}) => {
  return (
    <ColumnsRegion
      gap={photo ? 24 : 0}
      gridTemplateColumns="fit-content(30%) minmax(0, 1fr)"
      leftColumn={
        photo && (
          <div
            className=" w-40 h-40 shrink-0 bg-gray-50 bg-cover bg-center -mt-8"
            style={{
              backgroundImage: photo ? `url(${photo})` : undefined,
            }}
          ></div>
        )
      }
      rightColumn={
        <div className="font-brand mb-12 w-full">
          <p className="mb-1 text-2xl">
            {data.firstName} {data.lastName}
          </p>
          <p className="text-2xl font-semibold">{data.jobTitle}</p>
        </div>
      }
    />
  );
};

export default HeaderSection;
