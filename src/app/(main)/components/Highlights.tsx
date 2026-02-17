"use client";

import { trackEvent } from "@/components/analytics/events";

type HighlightsItem = {
  text: string;
  subtext: string;
  color: "pink" | "blue" | "red";
};

const highlightsItems: HighlightsItem[] = [
  {
    text: "Free resume templates",
    subtext: "Modern designs that actually look good.",
    color: "pink",
  },
  {
    text: "No signup needed",
    subtext: "Build and download your resume instantly.",
    color: "blue",
  },
  {
    text: "Private by default",
    subtext: "Your data stays on your device.",
    color: "red",
  },
];

const HighlightsItem = ({
  item,
  count,
}: {
  item: HighlightsItem;
  count: number;
}) => {
  return (
    <li className="relative mx-auto flex items-start py-8">
      <div
        className="font-brand text-8xl font-bold opacity-50"
        style={{ color: `var(--brand-${item.color})` }}
      >
        {count}.
      </div>
      <div className="ml-2 pt-4 text-left">
        <h3 className="font-semibold">{item.text}</h3>
        <p>{item.subtext}</p>
      </div>
    </li>
  );
};

const Highlights = () => (
  <section aria-labelledby="features">
    <h2 id="features" className="sr-only">
      Resume builder features
    </h2>
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-0">
      <li className="gradient-separator md:gradient-separator-left gradient-separator-bottom order-first mx-auto px-12 py-8 text-center md:order-last md:text-left">
        <p className="mb-2 text-2xl font-semibold">Like it?</p>
        <p>Support us with a</p>
        <a
          href="https://paypal.me/cvoop"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold"
          onClick={() => trackEvent("donate_click", { btn_location: "hero" })}
        >
          donation💙
        </a>
      </li>
      {highlightsItems.map((item, i) => (
        <HighlightsItem item={item} count={i + 1} key={i} />
      ))}
    </ul>
  </section>
);

export default Highlights;
