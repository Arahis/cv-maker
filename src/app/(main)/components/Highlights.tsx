"use client";

import { trackEvent } from "@/components/analytics/events";

type HighlightsItem = { text: string; color: "pink" | "blue" | "red" };

const highlightsItems: HighlightsItem[] = [
  { text: "No registration required ", color: "pink" },
  { text: "Your data stays on your device", color: "blue" },
  { text: "100% free, indie project", color: "red" },
];

const HighlightsItem = ({
  item,
  count,
}: {
  item: HighlightsItem;
  count: number;
}) => {
  return (
    <div className="relative mx-auto flex items-center py-8">
      <div
        className="font-brand absolute z-[-1] text-8xl font-bold opacity-50"
        style={{ color: `var(--brand-${item.color})` }}
      >
        {count}.
      </div>
      <div>
        <p className="ml-6 font-semibold">{item.text}</p>
      </div>
    </div>
  );
};

const Highlights = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-0">
    <div className="gradient-separator md:gradient-separator-left gradient-separator-bottom order-first mx-auto px-12 py-8 text-center md:order-last md:text-left">
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
    </div>

    {highlightsItems.map((item, i) => (
      <HighlightsItem item={item} count={i + 1} key={i} />
    ))}
  </div>
);

export default Highlights;
