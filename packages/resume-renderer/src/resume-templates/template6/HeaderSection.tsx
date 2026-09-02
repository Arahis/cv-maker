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
      gap={photo ? 24 : 0}
      gridTemplateColumns="fit-content(30%) minmax(0, 1fr)"
      leftColumn={
        photo && (
          <div
            className=" w-40 h-40 shrink-0 bg-gray-50 bg-cover bg-center"
            style={{
              backgroundImage: photo ? `url(${photo})` : undefined,
            }}
          ></div>
        )
      }
      rightColumn={
        <div className="w-full">
          <div className="border-b border-gray-300  text-left">
            {/* <Paginate.Text className="text-3xl">Hello I&apos;m</Paginate.Text> */}
            <p className="text-4xl font-bold mb-1">
              {`${data.firstName || "First"} ${data.lastName || "Last"}`}
            </p>
            <p className="text-xl font-semibold mb-4">
              {data.jobTitle || "Profession"}
            </p>
          </div>
          <div className="pt-2 text-sm">
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
