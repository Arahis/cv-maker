import { ResumeForm } from "@cv-maker/shared";
import { ColumnsRegion } from "../../pagination/Pagination.js";

const HeaderSection = ({
  data,
  photo,
}: {
  data: ResumeForm;
  photo?: string | null;
}) => {
  return (
    <div className="border-b border-yellow-400 pb-8">
      <ColumnsRegion
        className="mb-8"
        gridTemplateColumns={"minmax(0, 7fr) minmax(0, 3fr)"}
        leftColumn={
          <div>
            {/* <p className="text-xl italic">Hello!</p> */}
            <div className="mb-1">
              <p className="text-3xl font-semibold">
                {data.firstName} {data.lastName}
              </p>
            </div>
            <p className="text-4xl font-bold">{data.jobTitle}</p>
          </div>
        }
        rightColumn={
          photo && (
            <div
              className="aspect-square w-[65%] m-auto rounded-full bg-gray-50 bg-cover bg-center outline-1 outline-offset-4 outline-yellow-400"
              style={{
                backgroundImage: photo ? `url(${photo})` : undefined,
              }}
            ></div>
          )
        }
      />
      <div className="grid grid-cols-3">
        {data.phone && (
          <div>
            <p className="font-semibold">Phone</p>
            <p className="text-[16px]">{data.phone}</p>
          </div>
        )}
        {data.email && (
          <div>
            <p className="font-semibold">Email</p>
            <p className="text-[16px]">{data.email}</p>
          </div>
        )}
        {(data.country || data.city) && (
          <div>
            <p className="font-semibold">Location</p>
            <p className="text-[16px]">
              {data.country}, {data.city}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderSection;
