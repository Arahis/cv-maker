"use client";

import { useEffect, useState } from "react";
import {
  ANALYTICS_CONSENT_KEY,
  type AnalyticsConsent,
} from "./GoogleAnalytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CookiePreferences = () => {
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false);

  useEffect(() => {
    setIsAnalyticsEnabled(
      window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "accepted",
    );
  }, []);

  const updateAnalyticsConsent = (enabled: boolean) => {
    const consent: AnalyticsConsent = enabled ? "accepted" : "rejected";

    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
    window.dispatchEvent(
      new CustomEvent<AnalyticsConsent>("cvoop:analytics-consent", {
        detail: consent,
      }),
    );

    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: enabled ? "granted" : "denied",
      });
    }

    setIsAnalyticsEnabled(enabled);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">Cookie preferences</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Allow Google Analytics cookies to help us understand how Cvoop is
            used. You can change this setting at any time.
          </p>
        </div>
        <label className="inline-flex shrink-0 cursor-pointer items-center gap-3">
          <span className="text-sm font-medium text-slate-700">
            {isAnalyticsEnabled ? "Enabled" : "Disabled"}
          </span>
          <input
            type="checkbox"
            className="peer sr-only"
            checked={isAnalyticsEnabled}
            onChange={(event) => updateAnalyticsConsent(event.target.checked)}
            aria-label="Enable Google Analytics cookies"
          />
          <span className="relative h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-blue-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-5" />
        </label>
      </div>
    </section>
  );
};

export default CookiePreferences;
