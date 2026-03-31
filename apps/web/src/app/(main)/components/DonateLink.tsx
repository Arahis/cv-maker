"use client";

import { trackEvent } from "@/components/analytics/events";

const DonateLink = () => {
  return (
    <a
      href="https://paypal.me/cvoop"
      target="_blank"
      rel="noopener noreferrer"
      className="link-hover mr-2 hidden px-4 py-2 font-bold md:block"
      onClick={() => trackEvent("donate_click", { btn_location: "navbar" })}
    >
      Support us
    </a>
  );
};

export default DonateLink;
