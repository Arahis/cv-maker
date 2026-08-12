import { LocationIcon } from "./Location.js";
import { MailIcon } from "./Mail.js";
import { PhoneIcon } from "./Phone.js";
import { WebIcon } from "./Web.js";

export const icons = {
  location: LocationIcon,
  mail: MailIcon,
  phone: PhoneIcon,
  web: WebIcon,
};

export type IconName = keyof typeof icons;
