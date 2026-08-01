import type { Metadata } from "next";
import { CircleCheck, CircleHelp, Minus } from "lucide-react";

export const metadata: Metadata = {
  title: "Plans",
  description: "Compare the features available to guests and free accounts.",
};

const planFeatures = [
  ["Active resumes", "1", "Unlimited"],
  ["PDF import", "1 successful", "2 successful"],
  ["Cloud storage", "No", "Yes"],
  ["Copy resumes", "No", "Yes"],
  ["Free templates", "Yes", "Yes"],
  // ["Premium templates", "No", "No"],
  ["PDF export", "Yes", "Yes"],
  // ["Create a tailored version", "Manually", "Limited"],
  // ["AI text enhancement", "No", "1 trial"],
  // ["ATS check", "No", "Preview result"],
  // ["Cover letter", "No", "No"],
] as const;

function FeatureValue({ value }: { value: string }) {
  if (value === "Yes") {
    return (
      <CircleCheck
        aria-label="Included"
        className="mx-auto size-4.5 stroke-[2.5]"
      />
    );
  }

  if (value === "No") {
    return (
      <Minus
        aria-label="Not included"
        className="mx-auto size-4.5 text-gray-400"
      />
    );
  }

  return <span>{value}</span>;
}

export default function PlansPage() {
  return (
    <main className="mx-auto max-w-250 px-4 py-20">
      <div className="mb-10 max-w-2xl">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">Plans</h1>
        <p className="text-gray-600">
          Compare the features available with a guest account and a free
          account. More features are on the way.
        </p>
      </div>

      <div role="table" aria-label="Plans and available features">
        <div
          role="row"
          className="mb-1 grid grid-cols-2 border-b border-gray-200 pb-4 md:grid-cols-[minmax(0,2fr)_1fr_1fr]"
        >
          <div
            role="columnheader"
            className="hidden text-xs font-medium tracking-[0.14em] text-gray-500 uppercase md:block"
          >
            Overview
          </div>
          <div
            role="columnheader"
            className="text-center text-sm font-semibold md:px-6"
          >
            Guest
          </div>
          <div
            role="columnheader"
            className="text-center text-sm font-semibold md:px-6"
          >
            Free Account
          </div>
        </div>

        {planFeatures.map(([feature, guest, freeAccount]) => (
          <div
            key={feature}
            role="row"
            className="grid grid-cols-2 border-b border-gray-200 last:border-b-0 md:grid-cols-[minmax(0,2fr)_1fr_1fr]"
          >
            <div
              role="rowheader"
              className="col-span-2 px-6 py-8 text-center text-sm font-semibold text-gray-900 md:col-span-1 md:px-0 md:py-4 md:text-left"
            >
              <span className="inline-flex items-center gap-1.5">
                {feature}
              </span>
            </div>
            <div
              role="cell"
              className="flex items-center justify-center border-t border-gray-100 px-6 py-7 text-sm text-gray-600 md:border-0 md:px-6 md:py-4"
            >
              <FeatureValue value={guest} />
            </div>
            <div
              role="cell"
              className="flex items-center justify-center border-t border-l border-gray-100 px-6 py-7 text-sm text-gray-600 md:border-0 md:px-6 md:py-4"
            >
              <FeatureValue value={freeAccount} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
