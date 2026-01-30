import React, { ComponentProps } from "react";
import { icons, IconName } from ".";

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
} & ComponentProps<"svg">;

const Icon = ({ name, className, ...props }: IconProps) => {
  const SVGIcon = icons[name];
  return <SVGIcon className={className} {...props} />;
};

export default Icon;
