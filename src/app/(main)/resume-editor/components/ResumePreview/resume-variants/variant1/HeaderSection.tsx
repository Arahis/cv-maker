import React from "react";
import Icon from "../../icons/Icon";
import { Paginate } from "../../Paginate";

const HeaderSection = () => {
  return (
    <Paginate.Section className="flex">
      <Paginate.Section className="mt-[-30px] w-[30%] bg-amber-300"></Paginate.Section>
      <Paginate.Section className="w-[70%] px-8">
        <Paginate.Section className="border-b border-gray-300 py-8 text-left">
          <Paginate.Text className="mb-1 text-4xl">
            Hello I&apos;m
          </Paginate.Text>
          <Paginate.Text className="text-4xl font-bold">
            Rosen Anderson
          </Paginate.Text>
        </Paginate.Section>
        <Paginate.Section className="pt-2">
          <Paginate.Section className="flex items-center gap-2">
            {/* <Icon name="location" size={16} /> */}
            <Paginate.Text>Address</Paginate.Text>
          </Paginate.Section>
          <Paginate.Section className="flex w-full">
            <div className="flex flex-1 items-center gap-2">
              {/* <Icon name="phone" size={16} /> */}
              <Paginate.Text>Phone</Paginate.Text>
            </div>
            {/* <div className="flex flex-1 items-center gap-2">
              <Icon name="mail" size={16} />
              <Paginate.Text>Mail</Paginate.Text>
            </div>
            <div className="flex flex-1 items-center gap-2">
              <Icon name="web" size={16} />
              <Paginate.Text>Website</Paginate.Text>
            </div> */}
          </Paginate.Section>
        </Paginate.Section>
      </Paginate.Section>
    </Paginate.Section>
  );
};

export default HeaderSection;
