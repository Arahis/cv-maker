import React from "react";
import Icon from "../../icons/Icon";
import { Paginate } from "../../Paginate";
import { ResumeForm } from "@/lib/validation";

const HeaderSection = ({
  data,
  photo,
}: {
  data: ResumeForm;
  photo?: string;
}) => {
  return (
    <Paginate.Columns className="mb-4 gap-8">
      {photo && (
        <Paginate.Section
          className="-mt-8 h-60 w-[30%] shrink-0 bg-gray-50 bg-cover bg-center"
          style={{
            backgroundImage: photo ? `url(${photo})` : undefined,
          }}
        ></Paginate.Section>
      )}

      <Paginate.Section className="w-full">
        <Paginate.Section className="border-b border-gray-300 py-6 text-left">
          {/* <Paginate.Text className="text-3xl">Hello I&apos;m</Paginate.Text> */}
          <Paginate.Text className="mb-2 text-4xl font-bold">
            {`${data.firstName || "First"} ${data.lastName || "Last"}`}
          </Paginate.Text>
          <Paginate.Text className="text-xl font-semibold">
            {data.jobTitle || "Profession"}
          </Paginate.Text>
        </Paginate.Section>
        <Paginate.Section className="pt-2">
          {(data.city || data.country) && (
            <Paginate.Section className="mb-1 flex items-center gap-2">
              <Icon name="location" size={16} />
              <Paginate.Text>{`${data.city}, ${data.country}`}</Paginate.Text>
            </Paginate.Section>
          )}

          <Paginate.Section className="flex items-center justify-start gap-2">
            {data.phone && (
              <div className="flex flex-1 items-center gap-2">
                <Icon name="phone" size={16} />
                <Paginate.Text>{data.phone}</Paginate.Text>
              </div>
            )}
            {data.email && (
              <div className="flex flex-1 items-center gap-2">
                <Icon name="mail" size={16} />
                <Paginate.Text>{data.email}</Paginate.Text>
              </div>
            )}
          </Paginate.Section>
        </Paginate.Section>
      </Paginate.Section>
    </Paginate.Columns>
  );
};

export default HeaderSection;
