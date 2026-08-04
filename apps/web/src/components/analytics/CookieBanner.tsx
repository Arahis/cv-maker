"use client";

import Link from "next/link";
import {
  ANALYTICS_CONSENT_KEY,
  type AnalyticsConsent,
} from "./GoogleAnalytics";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { isEuCountry } from "./location";

export function CookieIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      fill="none"
      viewBox="0 0 120 123"
    >
      <g clipPath="url(#a)">
        <path
          fill="#a4ceff"
          d="M60 0a58.7 58.7 0 0 1 16.113 2.244A13.44 13.44 0 0 0 74 9.5a13.45 13.45 0 0 0 3.581 9.157C72.931 22.78 70 28.797 70 35.5 70 47.926 80.074 58 92.5 58c4.07 0 7.887-1.082 11.181-2.972A13.5 13.5 0 0 0 115.5 62c1.577 0 3.091-.272 4.498-.77l.002.27c0 33.966-26.863 61.5-60 61.5S0 95.466 0 61.5 26.863 0 60 0m18.5 77a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19M38 79a6 6 0 1 0 0 12 6 6 0 0 0 0-12m22.5-30a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11M30 43a8 8 0 1 0 0 16 8 8 0 0 0 0-16m63.5-12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11M50 25a4 4 0 1 0 0 8 4 4 0 0 0 0-8M98.5 5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h120v123H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showForTesting = new URLSearchParams(window.location.search).has(
      "cookie_banner",
    );

    fetch("/api/location")
      .then((response) => response.json() as Promise<{ country?: string }>)
      .then(({ country }) => {
        setIsVisible(
          showForTesting ||
            (isEuCountry(country) &&
              window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === null),
        );
      })
      .catch(() => setIsVisible(showForTesting));
  }, []);

  const saveConsent = (consent: AnalyticsConsent) => {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
    window.dispatchEvent(
      new CustomEvent<AnalyticsConsent>("cvoop:analytics-consent", {
        detail: consent,
      }),
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
    >
      <div className="flex items-center gap-6">
        <div className="flex h-22 w-22 shrink-0 items-center justify-center rounded-full bg-blue-50">
          <CookieIcon />
        </div>
        <p className="text-sm leading-6 text-slate-700">
          We use analytics cookies to understand how Cvoop is used and improve
          the service. You can accept or decline them. You can change your
          choice at any time on the Cookie Policy page. Read more in our{" "}
          <Link
            href="/cookie-policy"
            className="font-medium text-blue-600 underline underline-offset-2"
          >
            Cookie Policy
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-col justify-center gap-1">
          <Button variant="default" onClick={() => saveConsent("accepted")}>
            Accept analytics
          </Button>
          <Button
            variant="ghost"
            className="text-gray-500"
            onClick={() => saveConsent("rejected")}
          >
            Decline
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default CookieBanner;
