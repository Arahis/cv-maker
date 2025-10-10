import { LocationIcon } from "./Location";
import { MailIcon } from "./Mail";
import { PhoneIcon } from "./Phone";
import { WebIcon } from "./Web";

export const icons = {
  location: LocationIcon,
  mail: MailIcon,
  phone: PhoneIcon,
  web: WebIcon,
};

export type IconName = keyof typeof icons;
