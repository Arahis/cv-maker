import React from "react";
import Icon from "../../icons/Icon";

const HeaderSection = () => {
  return (
    <div className="flex">
      <div className="mt-[-30px] w-[30%] bg-amber-300"></div>
      <div className="w-[70%] px-8">
        <div className="border-b border-gray-300 py-8 text-left">
          <p className="mb-1 text-4xl">Hello I&apos;m</p>
          <p className="text-4xl font-bold">Rosen Anderson</p>
        </div>
        <div className="pt-2">
          <div className="flex items-center gap-2">
            <Icon name="location" size={16} />
            <p>Address</p>
          </div>
          <div className="flex w-full">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
