"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { isEuCountry } from "./location";

export const ANALYTICS_CONSENT_KEY = "cvoop_analytics_consent";

export type AnalyticsConsent = "accepted" | "rejected";

const GoogleAnalytics = () => {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [isEuVisitor, setIsEuVisitor] = useState<boolean | null>(null);

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);

    if (storedConsent === "accepted" || storedConsent === "rejected") {
      setConsent(storedConsent);
    }

    fetch("/api/location")
      .then((response) => response.json() as Promise<{ country?: string }>)
      .then(({ country }) => setIsEuVisitor(isEuCountry(country)))
      .catch(() => setIsEuVisitor(null));

    const handleConsentChange = (event: Event) => {
      const nextConsent = (event as CustomEvent<AnalyticsConsent>).detail;
      setConsent(nextConsent);
    };

    window.addEventListener("cvoop:analytics-consent", handleConsentChange);
    return () =>
      window.removeEventListener(
        "cvoop:analytics-consent",
        handleConsentChange,
      );
  }, []);

  const canLoadAnalytics =
    consent === "accepted" || (isEuVisitor === false && consent !== "rejected");

  if (!gaId || !canLoadAnalytics) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            });
          `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
