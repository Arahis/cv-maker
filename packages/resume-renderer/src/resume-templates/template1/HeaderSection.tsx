import Icon from "../../icons/Icon.js";
import type { ResumeForm } from "@cv-maker/shared";
import { ColumnsRegion } from "../../pagination/Pagination.js";

const HeaderSection = ({
  data,
  photo,
}: {
  data: ResumeForm;
  photo?: string | null;
}) => {
  return (
    <ColumnsRegion
      // className="mb-4 gap-8"
      leftColumn={
        photo && (
          <div
            className="-mt-8 h-60 w-[30%] shrink-0 bg-gray-50 bg-cover bg-center"
            style={{
              backgroundImage: photo ? `url(${photo})` : undefined,
            }}
          ></div>
        )
      }
      rightColumn={
        <div className="w-full">
          <div className="border-b border-gray-300 py-6 text-left">
            {/* <Paginate.Text className="text-3xl">Hello I&apos;m</Paginate.Text> */}
            <p className="mb-2 text-4xl font-bold">
              {`${data.firstName || "First"} ${data.lastName || "Last"}`}
            </p>
            <p className="text-xl font-semibold">
              {data.jobTitle || "Profession"}
            </p>
          </div>
          <div className="pt-2">
            {(data.city || data.country) && (
              <div className="mb-1 flex items-center gap-2">
                <Icon name="location" size={16} />
                <p>{`${data.city}, ${data.country}`}</p>
              </div>
            )}

            <div className="flex items-center justify-start gap-2">
              {data.phone && (
                <div className="flex flex-1 items-center gap-2">
                  <Icon name="phone" size={16} />
                  <p>{data.phone}</p>
                </div>
              )}
              {data.email && (
                <div className="flex flex-1 items-center gap-2">
                  <Icon name="mail" size={16} />
                  <p>{data.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      }
    ></ColumnsRegion>
  );
};

export default HeaderSection;
