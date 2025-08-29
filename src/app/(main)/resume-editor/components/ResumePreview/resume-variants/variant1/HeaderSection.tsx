import React from "react";
import Icon from "../../icons/Icon";
import { Paginate } from "../../Paginate";

const HeaderSection = () => {
  return (
    <Paginate.Section className="flex">
      <Paginate.Section className="mt-[-30px] w-[30%] bg-amber-300"></Paginate.Section>
      <Paginate.Section className="w-[70%] px-8">
        <Paginate.Text className="border-b border-gray-300 py-8 text-left">
          <p className="mb-1 text-4xl">Hello I&apos;m</p>
          <p className="text-4xl font-bold">Rosen Anderson</p>
        </Paginate.Text>
        <Paginate.Section className="pt-2">
          <Paginate.Section className="flex items-center gap-2">
            <Icon name="location" size={16} />
            <p>Address</p>
          </Paginate.Section>
          <Paginate.Columns className="w-full">
            <div className="flex flex-1 items-center gap-2">
              <Icon name="phone" size={16} />
              <p>Phone</p>
            </div>
            <div className="flex flex-1 items-center gap-2">
              <Icon name="mail" size={16} />
              <p>Mail</p>
            </div>
            <div className="flex flex-1 items-center gap-2">
              <Icon name="web" size={16} />
              <p>Website</p>
            </div>
          </Paginate.Columns>
        </Paginate.Section>
      </Paginate.Section>
    </Paginate.Section>
  );
};

export default HeaderSection;
