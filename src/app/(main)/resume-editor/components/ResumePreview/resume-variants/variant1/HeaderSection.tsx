import React from "react";
import Icon from "../../icons/Icon";
import { Paginate } from "../../Paginate";

const HeaderSection = ({ data }: { data: any }) => {
  return (
    <Paginate.Section className="flex">
      <Paginate.Section className="mt-[-30px] h-[240px] w-[30%] bg-amber-300"></Paginate.Section>
      <Paginate.Section className="w-[70%] px-8">
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
            {data.website && (
              <div className="flex flex-1 items-center gap-2">
                <Icon name="web" size={16} />
                <Paginate.Text>Website</Paginate.Text>
              </div>
            )}
          </Paginate.Section>
        </Paginate.Section>
      </Paginate.Section>
    </Paginate.Section>
  );
};

export default HeaderSection;
